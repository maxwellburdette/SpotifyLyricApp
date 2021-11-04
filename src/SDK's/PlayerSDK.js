import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "react-bootstrap";
export default function PlayerSDK({
	accessToken,
	setDevice,
	setCurrentlyPlaying,
	track,
}) {
	const tempTrack = {
		name: "",
		album: {
			images: [{ url: "" }],
		},
		artists: [{ name: "" }],
	};
	const [player, setPlayer] = useState();
	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [current_track, setTrack] = useState(tempTrack);
	const [previousTrack, setPreviousTrack] = useState("");
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState();

	useEffect(() => {
		if (!previousTrack) {
			setPreviousTrack(current_track);
			return;
		}

		if (
			previousTrack.uri === undefined ||
			previousTrack.uri !== current_track.uri
		) {
			setCurrentlyPlaying(current_track);
			setPreviousTrack(current_track);
		}
	}, [current_track]);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "Lyric Player",
				getOAuthToken: (cb) => {
					cb(accessToken);
				},
				volume: 0.5,
			});

			setPlayer(player);

			player.addListener("ready", ({ device_id }) => {
				console.log("Ready with Device ID", device_id);
				setDevice(device_id);
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
			});

			player.addListener("player_state_changed", (state) => {
				if (!state) {
					return;
				}

				let position = state.position;
				setInterval(() => {
					position += state.paused ? 0 : 300;
					setPosition(0 + position);
				}, 300);

				setDuration(state.duration);
				setTrack(state.track_window.current_track);
				setPaused(state.paused);

				player.getCurrentState().then((state) => {
					!state ? setActive(false) : setActive(true);
				});
			});

			player.connect();
		};
	}, []);

	return (
		<div
			style={{ width: "100%", height: "100%" }}
			className="d-flex justify-content-center align-items-center position-relative"
		>
			<ProgressBar now={60} />

			{track ? (
				<div
					className="d-flex ml-2 align-items-center position-absolute"
					style={{ left: 0 }}
				>
					<img
						src={track.albumUrl}
						alt=""
						style={{ height: "64px", width: "64px" }}
					/>
					<div className="ml-3">
						<div style={{ color: "#fff" }}>{track.title}</div>
						<div className="text-muted" style={{ fontWeight: "300" }}>
							{track.artist}
						</div>
					</div>
				</div>
			) : (
				""
			)}

			<ul
				style={{ listStyle: "none" }}
				className="d-flex flex-direction-column m-2"
			>
				<li className="p-2 mt-2">
					<FontAwesomeIcon
						onClick={() => {
							player.previousTrack();
						}}
						style={{ color: "#fff", cursor: "pointer" }}
						icon={["fas", "step-backward"]}
						size="2x"
					/>
				</li>
				<li className="p-2">
					{/* <Button onClick={playButton}>Play</Button> */}
					<FontAwesomeIcon
						onClick={() => {
							player.togglePlay();
						}}
						style={{ color: "#fff", cursor: "pointer" }}
						icon={is_paused ? ["fas", "play-circle"] : ["fas", "pause-circle"]}
						size="3x"
					/>
				</li>
				<li className="p-2 mt-2">
					<FontAwesomeIcon
						onClick={() => {
							player.nextTrack();
						}}
						style={{ color: "#fff", cursor: "pointer" }}
						icon={["fas", "step-forward"]}
						size="2x"
					/>
				</li>
			</ul>
		</div>
	);
}
