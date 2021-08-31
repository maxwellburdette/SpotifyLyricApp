import { useEffect } from "react";
import { ListGroup, Image, Container } from "react-bootstrap";
import "./sidebar.css";
import AddSong from "./AddSong";
export default function SideBar({
	user,
	playlists,
	spotifyApi,
	setSearchResults,
	image,
	backgroundColor,
	addSong,
	setSongAdded,
	setCurrentPlaylist,
}) {
	useEffect(() => {
		if (!image) return;
	}, [image]);
	function handle(e) {
		e.preventDefault();
		let playlistId = e.target.value;
		spotifyApi.getPlaylist(playlistId).then(
			function (data) {
				setCurrentPlaylist(data.body.uri);
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
		<div
			className="d-flex flex-column justify-content-stretch position-relative"
			style={{ height: "100vh" }}
		>
			<ListGroup
				className=" justify-content-top"
				style={{
					overflowY: "auto",
					height: "60%",
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
				className="d-flex align-items-center justify-content-center position-relative"
				style={{
					overflowY: "hidden",
					height: "40%",
				}}
			>
				<ListGroup.Item
					className=""
					style={{
						background: "none",
						border: "none",
						maxWidth: "300px",
						minHeight: "200px",
					}}
				>
					<Image className="shadow" src={image} fluid />
				</ListGroup.Item>
			</ListGroup>
			<Container
				className="p-2 d-flex justify-content-center position-relative"
				style={{
					background: "linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)",
				}}
			>
				<AddSong
					className=""
					addSong={addSong}
					playlists={playlists}
					spotifyApi={spotifyApi}
					setSongAdded={setSongAdded}
				></AddSong>
			</Container>
		</div>
	);
}
