import { useState, useEffect } from "react";
import { ListGroup, Image } from "react-bootstrap";
import "./sidebar.css";

export default function SideBar({
	user,
	playlists,
	spotifyApi,
	setSearchResults,
	image,
	backgroundColor,
}) {
	useEffect(() => {
		if (!image) return;
		console.log(image);
	}, [image]);
	function handle(e) {
		e.preventDefault();
		let playlistId = e.target.value;
		spotifyApi.getPlaylist(playlistId).then(
			function (data) {
				console.log(data.body.tracks.items[0]);
				setSearchResults(
					data.body.tracks.items.map((track) => {
						const smallestAlbumImage = track.track.album.images.reduce(
							(smallest, image) => {
								if (image.height < smallest.height) return image;
								return smallest;
							}
						);

						const biggestAlbumImage = track.track.album.images.reduce(
							(largest, image) => {
								if (image.height > largest.height) return image;
								return largest;
							}
						);
						//const biggestAlbumImage = getMiddle(track.track.album.images);

						return {
							artist: track.track.artists[0].name,
							title: track.track.name,
							uri: track.track.uri,
							albumUrl: smallestAlbumImage.url,
							bigImage: biggestAlbumImage.url,
						};
					})
				);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}

	function getMiddle(e) {
		return e[1];
	}
	return (
		<div className="d-flex flex-column justify-content-stretch">
			<ListGroup
				className="justify-content-top"
				style={{
					overflowY: "auto",
					height: "100vh",
				}}
			>
				<h2
					className="py-2"
					style={{
						color: "#fff",
						background: "linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)",
						textAlign: "center",
						borderBottom: "1px solid #444",
					}}
				>
					{user}
					<h4 className="ml-2 mt-2" style={{ color: "#fff" }}>
						Playlists:
					</h4>
				</h2>
				{playlists.map((playlist) => (
					<ListGroup.Item
						key={Math.random()}
						className="selection "
						style={{
							color: "#fff",
							background: "linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)",
							textAlign: "center",
							border: "none",
						}}
						onClick={handle}
						value={playlist.id}
						action
					>
						{playlist.name}
					</ListGroup.Item>
				))}
				<ListGroup.Item
					style={{
						background: "none",
					}}
				>
					<Image src={image} fluid />
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
