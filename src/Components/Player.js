import { useState, useEffect, useRef } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Shuffle from "./Shuffle";
import axios from "axios";

export default function Player({ accessToken, spotifyApi, setAddSong }) {
	const [state, setState] = useState();
	const [currentlyPlaying, setCurrentlyPlaying] = useState();
	const [currentDevice, setCurrentDevice] = useState();
	const [track, setTrack] = useState();
	const player = useRef();
	useEffect(() => {
		if (!state) return;
		if (state.deviceId === state.currentDeviceId) {
			const track = state.track;
			if (!currentlyPlaying) {
				setCurrentlyPlaying(state.track);
				return;
			}

			if (currentlyPlaying.uri !== track.uri) {
				setCurrentlyPlaying(track);
			}
		} else {
			state.devices.map((device) => {
				if (device.is_active === true) {
					setCurrentDevice(device.id);

					const playingTrack = state.track;
					if (!currentlyPlaying) {
						setCurrentlyPlaying(playingTrack);
						return 0;
					}

					if (playingTrack.uri !== currentlyPlaying.uri) {
						setCurrentlyPlaying(playingTrack);
					}
				} else {
					setCurrentDevice(state.currentDeviceId);
				}
				return 0;
			});
		}
		// eslint-disable-next-line
	}, [state]);

	useEffect(() => {
		if (!currentDevice) return;
		var data = JSON.stringify({
			device_ids: [currentDevice],
		});

		var config = {
			method: "put",
			url: "https://api.spotify.com/v1/me/player",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
			data: data,
		};

		axios(config)
			.then(function (response) {})
			.catch(function (error) {
				console.log(error);
			});
		// eslint-disable-next-line
	}, [currentDevice]);

	useEffect(() => {
		if (!currentlyPlaying) return;

		spotifyApi
			.searchTracks(currentlyPlaying.name + " " + currentlyPlaying.artists)
			.then((res) => {
				const track = res.body.tracks.items[0];
				if (!track) return;
				const biggestAlbumImage = track.album.images.reduce(
					(largest, image) => {
						if (image.height > largest.height) return image;
						return largest;
					}
				);
				const smallestImage = track.album.images.reduce((smallest, image) => {
					if (image.height < smallest.height) return image;
					return smallest;
				});

				setTrack({
					artist: track.artists[0].name,
					title: track.name,
					uri: track.uri,
					albumUrl: smallestImage.url,
					bigImage: biggestAlbumImage.url,
				});
			});

		// eslint-disable-next-line
	}, [currentlyPlaying]);

	useEffect(() => {
		setAddSong(track);
		// eslint-disable-next-line
	}, [track]);

	if (!accessToken) return null;
	return (
		<div style={{ position: "relative" }}>
			<SpotifyPlayer
				ref={player}
				token={accessToken}
				showSaveIcon
				callback={(state) => {
					setState(state);
				}}
				syncExternalDevice={true}
				persistDeviceSelection={true}
				styles={{
					activeColor: "#fff",
					bgColor: "#333",
					color: "#fff",
					loaderColor: "#fff",
					sliderColor: "#1cb954",
					trackArtistColor: "#ccc",
					trackNameColor: "#fff",
				}}
				magnifySliderOnHover="true"
			/>
			<Shuffle spotifyApi={spotifyApi}></Shuffle>
		</div>
	);
}
