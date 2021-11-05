import { useEffect, useState } from "react";
import { ListGroup, Image, Container } from "react-bootstrap";
import "./sidebar.css";
import AddSong from "./AddSong";
import { Grow } from "@material-ui/core";
import axios from "axios";

export default function SideBar({
	user,
	playlists,
	spotifyApi,
	setSearchResults,
	image,
	addSong,
	setSongAdded,
	setCurrentPlaylist,
	imageLoading,
	setTrackComp,
	accessToken,
	bottomTrack,
	setBottomTrack,
	setTrackLoading,
	searchResults,
}) {
	const [offset, setOffset] = useState();
	const [playlist, setPlaylist] = useState();
	const [next, setNext] = useState();
	useEffect(() => {
		if (!image) return;
	}, [image]);
	function handle(e) {
		e.preventDefault();
		let playlistId = e.target.value;
		let total = e.target.id;
		setPlaylist(playlistId);
		setTrackComp([]);
		spotifyApi.getPlaylist(playlistId).then(
			function (data) {
				setCurrentPlaylist(data.body.uri);
				setOffset(total < 100 ? total : Math.round(total / 100) * 100);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);
	}

	useEffect(
		() => {
			if (!offset || !playlist) return;
			var config = {
				method: "get",
				url:
					offset > 100
						? `https://api.spotify.com/v1/playlists/${playlist}/tracks?offset=${offset}`
						: `https://api.spotify.com/v1/playlists/${playlist}/tracks`,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			};

			axios(config)
				.then((response) => {
					let data = response.data;
					setSearchResults(
						data.items
							.filter((payload) => {
								if (payload.track === null) {
									return false;
								}
								return true;
							})
							.reverse()
							.map((payload) => {
								const track = payload.track;
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
								};
							})
					);
					setNext(data.previous !== null ? data.previous : undefined);
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		// eslint-disable-next-line
		[offset]
	);

	useEffect(() => {
		if (
			!bottomTrack ||
			!next ||
			bottomTrack === false ||
			searchResults.length === 0
		) {
			setBottomTrack(false);
			setTrackLoading(false);
			return;
		}

		var config = {
			method: "get",
			url: next,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		};
		axios(config)
			.then((response) => {
				let data = response.data;

				data.items.reverse().forEach((item) => {
					setSearchResults((prev) => [...prev, getTrack(item)]);
				});
				setNext(data.previous !== null ? data.previous : undefined);
				setBottomTrack(false);
				setTrackLoading(false);
			})
			.catch(function (error) {
				console.log(error);
			});
		// eslint-disable-next-line
	}, [bottomTrack]);

	function getTrack(item) {
		const track = item.track;

		const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
			if (image.height < smallest.height) return image;
			return smallest;
		});

		const biggestAlbumImage = track.album.images.reduce((largest, image) => {
			if (image.height > largest.height) return image;
			return largest;
		});

		return {
			artist: track.artists[0].name,
			title: track.name,
			uri: track.uri,
			albumUrl: smallestAlbumImage.url,
			bigImage: biggestAlbumImage.url,
		};
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
					{user ? user.display_name : ""}
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
						id={playlist.tracks.total}
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
					<Grow in={!imageLoading} exit={false}>
						<Image className="shadow" src={image} fluid />
					</Grow>
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
