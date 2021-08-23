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
	const player = useRef();
	const lyricsEndpoint = process.env.REACT_APP_LYRICS || process.env.LYRICS;
	const colorEndpoint = process.env.REACT_APP_COLOR || process.env.COLOR;
	console.log(lyricsEndpoint);
	console.log(colorEndpoint);
	useEffect(() => {
		if (!state) return;
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
			}
			return 0;
		});
		// eslint-disable-next-line
	}, [state]);

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
				syncExternalDevice="true"
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
