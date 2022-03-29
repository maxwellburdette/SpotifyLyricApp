import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import "./Player.css";
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
	const [value, setValue] = useState(0.5);
	const sliderRef = useRef();
	const [mute, setMute] = useState(false);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		if (!value || !player) return;
		console.log(value);
		if (value <= 0.05) {
			setMute(true);
			player.setVolume(0);
			return;
		}
		setMute(false);
		player.setVolume(value);
	}, [value]);

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
			// style={{ width: "100%", height: "100%" }}
			className="d-flex justify-content-between align-items-center position-relative"
		>
			{track ? (
				<div
					className="d-flex ml-2 mb-3 align-items-center position-relative"
					style={{ width: "30%" }}
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
				style={{ listStyle: "none", width: "60%" }}
				className="d-flex flex-direction-colum justify-content-center align-items-center mb-2 p-2"
			>
				<li className="p-2 play">
					<ion-icon
						name="play-skip-back"
						onClick={() => {
							player.previousTrack();
						}}
						style={{
							width: "2em",
							height: "2em",
							color: "#fff",
							cursor: "pointer",
						}}
					></ion-icon>
					{/* <FontAwesomeIcon
						onClick={() => {
							player.previousTrack();
						}}
						style={{ color: "#fff", cursor: "pointer" }}
						icon={["fas", "step-backward"]}
						size="2x"
					/> */}
				</li>
				<li className="p-2 mb-2 play">
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
				<li className="p-2 play">
					{/* <FontAwesomeIcon
						onClick={() => {
							player.nextTrack();
						}}
						style={{ color: "#fff", cursor: "pointer" }}
						icon={["fas", "step-forward"]}
						size="2x"
					/> */}
					<ion-icon
						name="play-skip-forward"
						onClick={() => {
							player.nextTrack();
						}}
						style={{
							width: "2em",
							height: "2em",
							color: "#fff",
							cursor: "pointer",
						}}
					></ion-icon>
				</li>
			</ul>
			<Box sx={{ width: "25%" }} className="mb-2 p-2">
				<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
					{!mute ? (
						<VolumeDown style={{ color: "#fff" }} />
					) : (
						<VolumeOffIcon style={{ color: "#fff" }}></VolumeOffIcon>
					)}
					<Slider
						aria-label="Volume"
						id="bar"
						min={0.0}
						step={0.05}
						max={1}
						value={value}
						onChange={handleChange}
						ref={sliderRef}
					/>
					<VolumeUp style={{ color: "#fff" }} />
				</Stack>
			</Box>
			<Slider
				className="position-absolute"
				id="bar"
				defaultValue={50}
				aria-label="Default"
				size="small"
				style={{ bottom: 0, marginTop: "10px" }}
			/>
		</div>
	);
}
