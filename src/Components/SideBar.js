import React from "react"
import { ListGroup } from "react-bootstrap"
import "./sidebar.css"

export default function SideBar({
	user,
	playlists,
	spotifyApi,
	setSearchResults
}) {
	function handle(e) {
		e.preventDefault()
		let playlistId = e.target.value
		spotifyApi.getPlaylist(playlistId).then(
			function (data) {
				console.log(data.body.tracks.items[0])
				setSearchResults(
					data.body.tracks.items.map(track => {
						const smallestAlbumImage = track.track.album.images.reduce(
							(smallest, image) => {
								if (image.height < smallest.height) return image
								return smallest
							},
							track.track.album.images[0]
						)
						return {
							artist: track.track.artists[0].name,
							title: track.track.name,
							uri: track.track.uri,
							albumUrl: smallestAlbumImage.url
						}
					})
				)
			},
			function (err) {
				console.log("Something went wrong!", err)
			}
		)
	}
	return (
		<div>
			<h1
				className="pt-2 mt-2"
				style={{
					color: "#fff",
					textAlign: "center",
					borderBottom: "1px solid #444"
				}}
			>
				{user}
			</h1>
			<h3 className="ml-2 mt-2" style={{ color: "#fff" }}>
				Playlists:
			</h3>
			<ListGroup
				className="my-2"
				style={{
					overflow: "hidden"
				}}
			>
				{playlists.map(playlist => (
					<ListGroup.Item
						key={Math.random()}
						className="selection p-2"
						style={{
							color: "#fff",
							background: "#333",
							textAlign: "center",
							border: "none"
						}}
						onClick={handle}
						value={playlist.id}
						action
					>
						{playlist.name}
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	)
}
