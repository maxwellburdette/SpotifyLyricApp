import React, { useState, useEffect } from "react";
import PlayerSDK from "../SDK's/PlayerSDK";
import { Container } from "react-bootstrap";

export default function Player({ accessToken, setAddSong, setImageLoading }) {
	const [currentlyPlaying, setCurrentlyPlaying] = useState();
	const [track, setTrack] = useState();

	useEffect(() => {
		if (!currentlyPlaying) return;

		const biggestAlbumImage = currentlyPlaying.album.images.reduce(
			(largest, image) => {
				if (image.height > largest.height) return image;
				return largest;
			}
		);
		const smallestImage = currentlyPlaying.album.images.reduce(
			(smallest, image) => {
				if (image.height < smallest.height) return image;
				return smallest;
			}
		);

		setTrack({
			artist: currentlyPlaying.artists[0].name,
			title: currentlyPlaying.name,
			uri: currentlyPlaying.uri,
			albumUrl: smallestImage.url,
			bigImage: biggestAlbumImage.url,
		});

		// eslint-disable-next-line
	}, [currentlyPlaying]);

	useEffect(() => {
		setAddSong(track);
		setImageLoading(true);
		// eslint-disable-next-line
	}, [track]);

	if (!accessToken) return null;
	return (
		<Container fluid>
			<PlayerSDK
				style={{ position: "relative" }}
				accessToken={accessToken}
				setCurrentlyPlaying={setCurrentlyPlaying}
				track={track}
			></PlayerSDK>
		</Container>
	);
}
