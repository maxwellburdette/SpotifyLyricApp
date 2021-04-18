import { useState, useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import SideBar from "./SideBar";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import "../App.css";

const spotifyApi = new SpotifyWebApi({
	clientId: "6f1aee81690d4ed7a9ea151f597c4fd1",
});

export default function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [playingTrack, setPlayingTrack] = useState();
	const [lyrics, setLyrics] = useState("");
	const [user, setUser] = useState("");
	const [playlists, setPlaylists] = useState([]);

	function chooseTrack(track) {
		setPlayingTrack(track);
		setSearch("");
		setLyrics("");
		setSearchResults([]);
	}

	useEffect(() => {
		if (!playingTrack) return;
		ColorThief.getColor(playingTrack.albumUrl)
			.then((color) => {
				console.log(color);
			})
			.catch((err) => {
				console.log(err);
			});
		console.log(playingTrack.albumUrl);
		axios
			.get("http://localhost:3001/lyrics", {
				params: {
					track: playingTrack.title,
					artist: playingTrack.artist,
				},
			})
			.then((res) => {
				setLyrics(res.data.lyrics);
			});
	}, [playingTrack]);

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
		getUser();
		getPlaylists();
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
						},
						track.album.images[0]
					);

					return {
						artist: track.artists[0].name,
						title: track.name,
						uri: track.uri,
						albumUrl: smallestAlbumImage.url,
					};
				})
			);
		});

		return () => (cancel = true);
	}, [search, accessToken]);

	function getUser() {
		spotifyApi.getMe().then(
			function (data) {
				setUser(data.body.display_name);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}

	function getPlaylists() {
		spotifyApi.getUserPlaylists("1256157461").then(
			function (data) {
				setPlaylists(data.body.items);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}

	return (
		<Container className="d-flex" style={{ width: "100%", margin: 0 }} fluid>
			<Container
				className=""
				style={{ height: "100vh", background: "#333", width: "25%" }}
			>
				<SideBar
					user={user}
					playlists={playlists}
					accessToken={accessToken}
					spotifyApi={spotifyApi}
					setSearchResults={setSearchResults}
				/>
			</Container>
			<Container
				className="d-flex flex-column py-2"
				style={{ height: "100vh", backgroundColor: "#636262", width: "75%" }}
			>
				<Form.Control
					type="search"
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
						/>
					))}
					{searchResults.length === 0 && (
						<div
							className="text-center "
							style={{
								whiteSpace: "pre",
								backgroundColor: "white",
								borderRadius: "5px",
							}}
						>
							{lyrics}
						</div>
					)}
				</div>
				<div>
					<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
				</div>
			</Container>
		</Container>
	);
}
