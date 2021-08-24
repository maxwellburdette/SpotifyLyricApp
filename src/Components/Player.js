import { useState, useEffect, useRef } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Shuffle from "./Shuffle";
import axios from "axios";

export default function Player({
	accessToken,
	trackUri,
	setColor,
	setImage,
	setLyrics,
	spotifyApi,
	setAddSong,
}) {
	const [play, setPlay] = useState(false);
	const [state, setState] = useState();
	const [currentlyPlaying, setCurrentlyPlaying] = useState();
	const [currentDevice, setCurrentDevice] = useState();
	const player = useRef();
	const lyricsEndpoint = process.env.REACT_APP_LYRICS || process.env.LYRICS;
	const colorEndpoint = process.env.REACT_APP_COLOR || process.env.COLOR;
	useEffect(() => {
		if (!state) return;
		if (currentDevice) {
			console.log(state.track);
			const trackState = state.track;

			spotifyApi
				.searchTracks(trackState.name + " " + trackState.artists)
				.then((res) => {
					const track = res.body.tracks.items[0];
					const biggestAlbumImage = track.album.images.reduce(
						(largest, image) => {
							if (image.height > largest.height) return image;
							return largest;
						}
					);
					setImage(biggestAlbumImage.url);
				});

			axios
				.get(colorEndpoint, {
					params: {
						album: trackState.image,
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then((res) => {
					setColor(res.data.domColor);
					//console.log(color);
				});
			axios
				.get(lyricsEndpoint, {
					params: {
						track: trackState.name,
						artist: trackState.artists,
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then((res) => {
					setLyrics(res.data.lyrics);
				});
			return 0;
		}
		state.devices.map((device) => {
			if (device.is_active === true) {
				player.current.state.currentDeviceId = device.id;
				setPlay(true);
				const playingTrack = state.track;
				if (playingTrack.uri === "") {
					setCurrentlyPlaying(playingTrack);
					return 0;
				}

				if (playingTrack.uri !== currentlyPlaying.uri) {
					setCurrentlyPlaying(playingTrack);

					spotifyApi
						.searchTracks(playingTrack.name + " " + playingTrack.artists)
						.then((res) => {
							const track = res.body.tracks.items[0];
							const biggestAlbumImage = track.album.images.reduce(
								(largest, image) => {
									if (image.height > largest.height) return image;
									return largest;
								}
							);
							setImage(biggestAlbumImage.url);
						});

					axios
						.get(colorEndpoint, {
							params: {
								album: playingTrack.image,
							},
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
						})
						.then((res) => {
							setColor(res.data.domColor);
							//console.log(color);
						});
					axios
						.get(lyricsEndpoint, {
							params: {
								track: playingTrack.name,
								artist: playingTrack.artists,
							},
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
						})
						.then((res) => {
							setLyrics(res.data.lyrics);
						});
				}
			} else {
				setCurrentDevice(state.currentDeviceId);
			}
			return 0;
		});
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
			.then(function (response) {
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
			});
	}, [currentDevice]);

	useEffect(() => {
		setAddSong(currentlyPlaying);
		// eslint-disable-next-line
	}, [currentlyPlaying]);

	useEffect(() => setPlay(true), [trackUri]);
	if (!accessToken) return null;
	return (
		<div style={{ position: "relative" }}>
			<SpotifyPlayer
				ref={player}
				token={accessToken}
				showSaveIcon
				callback={(state) => {
					setState(state);
					if (!state.isPlaying) setPlay(false);
				}}
				play={play}
				uris={trackUri ? [trackUri] : []}
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
