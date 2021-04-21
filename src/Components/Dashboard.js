import { useState, useEffect } from "react"
import useAuth from "../Hooks/useAuth"
import TrackSearchResult from "./TrackSearchResult"
import Player from "./Player"
import SideBar from "./SideBar"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import "../App.css"

const spotifyApi = new SpotifyWebApi({
	clientId: "6f1aee81690d4ed7a9ea151f597c4fd1"
})

export default function Dashboard({
	code,
	setBackgroundColor,
	backgroundColor
}) {
	const accessToken = useAuth(code)
	const [search, setSearch] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const [playingTrack, setPlayingTrack] = useState()
	const [lyrics, setLyrics] = useState("")
	const [user, setUser] = useState("")
	const [playlists, setPlaylists] = useState([])
	const [color, setColor] = useState([])
	const [image, setImage] = useState("")

	function chooseTrack(track) {
		setPlayingTrack(track)
		setSearch("")
		setLyrics("")
		setSearchResults([])
	}

	useEffect(() => {
		if (!playingTrack) return

		setImage(playingTrack.bigImage);

		console.log(playingTrack.albumUrl)
		axios
			.get("http://localhost:3001/lyrics", {
				params: {
					track: playingTrack.title,
					artist: playingTrack.artist
				}
			})
			.then(res => {
				setLyrics(res.data.lyrics)
			})
		axios
			.get("http://localhost:3001/color", {
				params: {
					album: playingTrack.albumUrl
				}
			})
			.then(res => {
				setColor(res.data.domColor)
				console.log(color)
			})
	}, [playingTrack])

	useEffect(() => {
		setBackgroundColor(
			"linear-gradient(rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 0.5), rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 1))"
		)

	}, [color])

	useEffect(() => {
		if (!accessToken) return
		spotifyApi.setAccessToken(accessToken)
		getUser()
		getPlaylists()
	}, [accessToken])

	useEffect(() => {
		if (!search) return setSearchResults([])
		if (!accessToken) return

		let cancel = false
		spotifyApi.searchTracks(search).then(res => {
			if (cancel) return
			setSearchResults(
				res.body.tracks.items.map(track => {
					const smallestAlbumImage = track.album.images.reduce(
						(smallest, image) => {
							if (image.height < smallest.height) return image
							return smallest
						},
						
					)
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
						bigImage: biggestAlbumImage.url
					}
				})
			)
		})

		return () => (cancel = true)
	}, [search, accessToken])

	function getUser() {
		spotifyApi.getMe().then(
			function (data) {
				setUser(data.body.display_name)
			},
			function (err) {
				console.log("Something went wrong!", err)
			}
		)
	}

	function getPlaylists() {
		spotifyApi.getUserPlaylists("1256157461").then(
			function (data) {
				setPlaylists(data.body.items)
			},
			function (err) {
				console.log("Something went wrong!", err)
			}
		)
	}

	return (
		<Container className="d-flex p-0 mb-0" style={{ width: "100%", height: "100vh"}} fluid>
			<Container
				className=""
				style={{
					
					width: "25%",
					overflow: "hidden"
				}}
			>
				<SideBar
					user={user}
					playlists={playlists}
					accessToken={accessToken}
					spotifyApi={spotifyApi}
					setSearchResults={setSearchResults}
					image={image}
					backgroundColor={backgroundColor}
				/>
			</Container>
			<Container
				className="d-flex flex-column pt-2 px-1 pb-0"
				style={{ border: " 1px solid #636262", background: "linear-gradient(rgb(52,52,52,.5), rgb(52,52,52,1)", height: "100vh", width: "75%" }}
			>
				<Form.Control
					type="search"
					className="p-2"
					placeholder="Search Songs/Artists"
					value={search}
					onChange={e => setSearch(e.target.value)}
				></Form.Control>
				<div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
					{searchResults.map(track => (
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
								borderRadius: "5px"
							}}
						>
							{lyrics}
						</div>
					)}
				</div>
				<Container fluid>
					<div className="mb-2">
						<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
					</div>
				</Container>
			</Container>
		</Container>
	)
}
