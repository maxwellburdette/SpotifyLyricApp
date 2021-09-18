import { useState, useEffect, useRef } from "react";
import useAuth from "../Hooks/useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import SideBar from "./SideBar";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import "../App.css";
import Success from "./Success";
import logo from "../Spotify_Icon_RGB_White.png";
import { Grow } from "@material-ui/core";

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.REACT_APP_PROD_ID || process.env.PROD_ID,
});

export default function Dashboard({
	code,
	setBackgroundColor,
	backgroundColor,
}) {
	const accessToken = useAuth(code);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [lyrics, setLyrics] = useState("");
	const [user, setUser] = useState();
	const [playlists, setPlaylists] = useState([]);
	const [color, setColor] = useState([]);
	const [image, setImage] = useState(logo);
	const [addSong, setAddSong] = useState();
	const [songAdded, setSongAdded] = useState(false);
	const [currentPlaylist, setCurrentPlaylist] = useState();
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const title = useRef(document.getElementById("title"));

	//API
	const lyricsEndpoint = process.env.REACT_APP_LYRICS;
	const colorEndpoint = process.env.REACT_APP_COLOR;

	function chooseTrack(track) {
		setAddSong(track);
		setSearch("");
		setLyrics("");
		setCurrentPlaylist("");
		setSearchResults([]);
	}

	useEffect(() => {
		setTimeout(function () {
			setSongAdded(false);
		}, 5000);
	}, [songAdded]);

	useEffect(() => {
		if (!addSong) return;
		updateDashboard();

		// eslint-disable-next-line
	}, [addSong]);

	useEffect(() => {
		setBackgroundColor(
			"linear-gradient(rgba(" +
				color[0] +
				"," +
				color[1] +
				"," +
				color[2] +
				", 0.5), rgba(" +
				color[0] +
				"," +
				color[1] +
				"," +
				color[2] +
				", 1))"
		);
		// eslint-disable-next-line
	}, [color]);

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
		getUser();
		//getPlaylists();
	}, [accessToken]);

	useEffect(() => {
		if (!search) return setSearchResults([]);
		if (!accessToken) return;
		let cancel = false;
		spotifyApi.searchTracks(search).then((res) => {
			if (cancel) return;
			setSearchResults(
				res.body.tracks.items.map((track) => {
					const smallestAlbumImage = track.album.images.reduce(
						(smallest, image) => {
							if (image.height < smallest.height) return image;
							return smallest;
						}
					);
					const biggestAlbumImage = track.album.images.reduce(
						(largest, image) => {
							if (image.height > largest.height) return image;
							return largest;
						}
					);

					return {
						artist: track.artists[0].name,
						title: track.name,
						uri: track.uri,
						albumUrl: smallestAlbumImage.url,
						bigImage: biggestAlbumImage.url,
						albumUri: track.album.uri,
					};
				})
			);
		});

		return () => (cancel = true);
	}, [search, accessToken]);

	function updateDashboard() {
		title.current.innerHTML = addSong.title + " • " + addSong.artist;
		const currentSong = addSong.uri;
		setLoading(true);

		if (currentSong !== addSong.uri) {
			updateDashboard();
			return;
		}
		setImage(addSong.bigImage);
		setTimeout(() => {
			setImageLoading(false);
		}, 200);

		axios
			.get(lyricsEndpoint, {
				params: {
					track: addSong.title,
					artist: addSong.artist,
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.then(async (res) => {
				await setLyrics(res.data.lyrics);
				setLoading(false);
			});
		axios
			.get(colorEndpoint, {
				params: {
					album: addSong.albumUrl,
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.then((res) => {
				setColor(res.data.domColor);
			});
	}
	function getUser() {
		spotifyApi.getMe().then(
			function (data) {
				setUser(data.body);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}

	useEffect(() => {
		if (!user) return;
		spotifyApi.getUserPlaylists(user.id).then(
			function (data) {
				setPlaylists(data.body.items);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}, [user]);

	return (
		<Container
			className="d-flex p-0 mb-0"
			style={{ width: "100%", height: "100vh" }}
			fluid
		>
			<Container
				style={{
					width: "25%",
					overflow: "hidden",
				}}
			>
				<SideBar
					style={{ width: "100%" }}
					user={user}
					playlists={playlists}
					accessToken={accessToken}
					spotifyApi={spotifyApi}
					setSearchResults={setSearchResults}
					image={image}
					backgroundColor={backgroundColor}
					addSong={addSong}
					setSongAdded={setSongAdded}
					setCurrentPlaylist={setCurrentPlaylist}
					imageLoading={imageLoading}
				/>
			</Container>
			{songAdded ? (
				<Success style={{ position: "absolute", bottom: "0" }}></Success>
			) : (
				""
			)}
			<Container
				className="d-flex flex-column pt-2 px-1 pb-0"
				style={{
					border: " 1px solid #636262",
					background: "linear-gradient(rgb(52,52,52,.5), rgb(52,52,52,1)",
					height: "100vh",
					width: "75%",
				}}
			>
				<Form.Control
					type="search"
					className="p-2"
					placeholder="Search Songs/Artists"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				></Form.Control>

				<div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
					{searchResults.map((track) => (
						<TrackSearchResult
							track={track}
							key={track.uri}
							chooseTrack={chooseTrack}
							currentPlaylist={currentPlaylist}
							accessToken={accessToken}
						/>
					))}
					{searchResults.length === 0 && (
						<Grow in={!loading} exit={false}>
							<div
								className={`text-center ${loading ? "skeleton" : ""}`}
								style={{
									whiteSpace: "pre",
									backgroundColor: "white",
									borderRadius: "5px",
								}}
							>
								{!loading ? lyrics : ""}
							</div>
						</Grow>
					)}
				</div>

				<Container fluid>
					<div className="mb-2">
						<Player
							accessToken={accessToken}
							spotifyApi={spotifyApi}
							setAddSong={setAddSong}
							setImageLoading={setImageLoading}
						/>
					</div>
				</Container>
			</Container>
		</Container>
	);
}
