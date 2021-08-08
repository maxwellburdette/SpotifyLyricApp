import { useEffect } from "react";
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
	}, [image]);
	function handle(e) {
		e.preventDefault();
		let playlistId = e.target.value;
		spotifyApi.getPlaylist(playlistId).then(
			function (data) {
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

	return (
		<div className="d-flex flex-column justify-content-stretch position-relative">
			<ListGroup
				className="mb-2 justify-content-top"
				style={{
					overflowY: "auto",
					height: "60vh",
				}}
			>
				<h2
					className="py-2 sticky-top m-0"
					style={{
						color: "#fff",
						background: "linear-gradient(rgba(52,52,52,1), rgba(52,52,52,1)",
						textAlign: "center",
						borderBottom: "1px solid #444",
						width: "100%",
					}}
				>
					{user}
					<br />
					<span
						className="ml-2 mt-2"
						style={{ color: "#fff", fontSize: ".7em", width: "100%" }}
					>
						Playlists:
					</span>
					{/* <h4 className="ml-2 mt-2" style={{ color: "#fff" }}>
						Playlists:
					</h4> */}
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
			</ListGroup>
			<ListGroup
				className="d-flex align-items-center justify-content-center mb-3"
				style={{
					overflowY: "auto",
					height: "40vh",
				}}
			>
				<ListGroup.Item
					className=""
					style={{
						background: "none",
						border: "none",
						maxWidth: "300px",
					}}
				>
					<Image className="shadow" src={image} fluid />
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
