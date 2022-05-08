import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import styles from "./Player.css";
import axios from "axios";
import { withStyles } from "@material-ui/styles";

const NO_DEVICE = "NO_DEVICE";

function PlayerSDK({ accessToken, setCurrentlyPlaying, track }) {
	const tempTrack = {
		name: "",
		album: {
			images: [{ url: "" }],
		},
		artists: [{ name: "" }],
	};
	const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
		minimumIntegerDigits: 2,
	});
	const [player, setPlayer] = useState();
	const [deviceState, setDeviceState] = useState();
	const [deviceId, setDeviceId] = useState();
	const [playerState, setPlayerState] = useState();
	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [current_track, setTrack] = useState(tempTrack);
	const [previousTrack, setPreviousTrack] = useState("");
	const [duration, setDuration] = useState(0);
	const [value, setValue] = useState(0.5);
	const sliderRef = useRef();
	const [mute, setMute] = useState(false);
	const [shuffle, setShuffle] = useState(false);
	const [prevVol, setPrevVol] = useState();
	const [currentPosition, setCurrentPosition] = useState(0.5);
	const [intervalFunc, setIntervalFunc] = useState();
	const [deviceInterval, setDeviceInterval] = useState();
	const [repeat, setRepeat] = useState();
	const [seeking, setSeeking] = useState(false);

	function handleChange(event, newValue) {
		setValue(newValue);
	}
	function handleChange2(event, newValue) {
		setSeeking(true);
		setCurrentPosition(newValue);
	}

	function formatTime(time) {
		const totalSeconds = time / 1000;
		const seconds = Math.floor(totalSeconds % 60);
		const minutes = Math.floor(totalSeconds / 60) % 60;
		const hours = Math.floor(totalSeconds / 3600);
		if (hours === 0) {
			return `${minutes} : ${leadingZeroFormatter.format(seconds)}`;
		}
		return `${hours} : ${leadingZeroFormatter.format(
			minutes
		)} : ${leadingZeroFormatter.format(seconds)}`;
	}

	async function handleShuffle() {
		const config = {
			method: "put",
			url: `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		};
		axios(config)
			.then(function () {
				setShuffle((prevState) => !prevState);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	function getRepeatState() {
		switch (repeat) {
			case 0:
				return "context";
			case 1:
				return "track";
			case 2:
				return "off";
			default:
				return;
		}
	}
	async function handleRepeat() {
		// track, context or off.
		const config = {
			method: "put",
			url: `https://api.spotify.com/v1/me/player/repeat?state=${getRepeatState()}`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		};

		axios(config)
			.then(function () {
				if (repeat === 2) {
					setRepeat(0);
					return;
				}
				setRepeat((prevState) => prevState + 1);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function setDevice(id) {
		const data = JSON.stringify({
			device_ids: [id],
		});

		const config = {
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
			.then(function () {})
			.catch(function (error) {
				console.log(error);
			});
	}

	useEffect(() => {
		if (!deviceState) return;
		const device = deviceState?.device;
		if (!device || device.id !== deviceId) {
			setDevice(deviceId);
		}
		// eslint-disable-next-line
	}, [deviceState]);

	useEffect(() => {
		if (!playerState?.position) return;
		if (!is_paused && !seeking) {
			setCurrentPosition(playerState.position);
		}
		// eslint-disable-next-line
	}, [playerState]);

	useEffect(() => {
		if (!value || !player) return;
		if (value <= 0.05) {
			setPrevVol(0.1);
			setMute(true);
			player.setVolume(0);
			return;
		}
		setMute(false);
		player.setVolume(value);
		// eslint-disable-next-line
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
			setCurrentPosition(0);
		}

		// eslint-disable-next-line
	}, [current_track]);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		clearInterval(intervalFunc);
		clearInterval(deviceInterval);
		setValue(0.5);

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
				console.log(is_active);
				setDevice(device_id);
				setDeviceId(device_id);
				setIntervalFunc(
					setInterval(async () => {
						setPlayerState(await player.getCurrentState());
					}, 500)
				);

				setDeviceInterval(
					setInterval(() => {
						var config = {
							method: "get",
							url: "https://api.spotify.com/v1/me/player",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								Authorization: `Bearer ${accessToken}`,
							},
						};

						axios(config)
							.then(function (response) {
								const data = response.data;
								if (!data) {
									setDeviceState(NO_DEVICE);
									return;
								}
								setDeviceState(data);
							})
							.catch(function (error) {
								console.log(error);
							});
					}, 10000)
				);
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
				setDevice(device_id);
			});

			player.addListener("player_state_changed", (state) => {
				if (!state) return;
				let position = state.position;
				setCurrentPosition(position);
				setDuration(state.duration);
				setTrack(state.track_window.current_track);
				setPaused(state.paused);
				setShuffle(state.shuffle ?? false);
				setRepeat(state.repeat_mode);

				player.getCurrentState().then((state) => {
					!state ? setActive(false) : setActive(true);
				});
			});

			document.addEventListener("keypress", (e) => {
				if (e.code === "Space") {
					player.togglePlay();
				}
			});
			player.connect();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div
			// style={{ width: "100%", height: "100%" }}
			className="d-flex justify-content-between align-items-center position-relative"
		>
			{track ? (
				<div
					className="d-flex ml-2 mb-3 mt-2 align-items-center position-relative"
					style={{ width: "25%" }}
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
				style={{ listStyle: "none", width: "50%" }}
				className="d-flex flex-direction-colum justify-content-center align-items-center mb-2 p-2"
			>
				<li className="p-2 play">
					<ion-icon
						name="shuffle-outline"
						onClick={handleShuffle}
						style={{
							width: "1.5em",
							height: "1.5em",
							color: !shuffle ? "#fff" : "#28a745",
						}}
					></ion-icon>
				</li>
				<li className="p-2 play">
					<ion-icon
						name="play-skip-back"
						onClick={() => {
							if (currentPosition >= 2000) {
								player.seek(0);
								setCurrentPosition(0);
								return;
							}
							player.previousTrack();
						}}
						style={{
							width: "1.5em",
							height: "1.5em",
							color: "#fff",
						}}
					></ion-icon>
				</li>
				<li className="p-2  play">
					<ion-icon
						onClick={() => {
							player.togglePlay();
						}}
						style={{
							width: "3em",
							height: "3em",
							color: "#fff",
						}}
						name={is_paused ? "play-circle-sharp" : "pause-circle-sharp"}
					></ion-icon>
				</li>
				<li className="p-2 play">
					<ion-icon
						name="play-skip-forward"
						onClick={() => {
							player.nextTrack();
						}}
						style={{
							width: "1.5em",
							height: "1.5em",
							color: "#fff",
						}}
					></ion-icon>
				</li>
				<li className="p-2 play mb-2">
					{repeat === 0 ? (
						<RepeatIcon
							onClick={handleRepeat}
							style={{
								width: ".8em",
								height: ".8em",
								color: "#fff",
							}}
						></RepeatIcon>
					) : repeat === 1 ? (
						<RepeatIcon
							onClick={handleRepeat}
							style={{
								width: ".8em",
								height: ".8em",
								color: "#28a745",
							}}
						></RepeatIcon>
					) : (
						<RepeatOneIcon
							onClick={handleRepeat}
							style={{
								width: ".8em",
								height: ".8em",
								color: "#28a745",
							}}
						></RepeatOneIcon>
					)}
				</li>
			</ul>
			<Box sx={{ width: "25%" }} className="mb-2 p-2">
				<Stack spacing={1.5} direction="row" sx={{ mb: 1 }} alignItems="center">
					<div className="play mt-1">
						<ion-icon
							name="list-sharp"
							style={{
								width: "1.5em",
								height: "1.5em",
								color: "#fff",
							}}
						></ion-icon>
					</div>

					{!mute ? (
						<div className="play">
							<VolumeDown
								onClick={() => {
									setPrevVol(value);
									setValue(0);
									player.setVolume(0);
									setMute(true);
								}}
								style={{ color: "#fff" }}
							/>
						</div>
					) : (
						<div className="play">
							<VolumeOffIcon
								onClick={() => {
									if (mute) {
										player.setVolume(prevVol);
										setValue(prevVol);
										setMute(false);
										return;
									}
								}}
								style={{ color: "#fff" }}
							></VolumeOffIcon>
						</div>
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
						size="small"
					/>
					<VolumeUp style={{ color: "#fff" }} />
				</Stack>
			</Box>
			<div
				className="position-absolute d-flex justify-content-center align-items-center"
				style={{ width: "100%", bottom: 0 }}
			>
				<Stack
					className="d-flex align-items-center"
					direction="horizontal"
					gap={2}
					style={{ width: "50%" }}
				>
					<div
						className="mt-2"
						style={{
							color: "#fff",
							width: "10%",
							fontSize: ".9em",
						}}
					>
						{formatTime(currentPosition)}
					</div>
					<Slider
						onChange={handleChange2}
						onChangeCommitted={(e, value) => {
							player.seek(value);
							setSeeking(false);
						}}
						id="bar"
						min={0.0}
						step={0.01}
						max={duration}
						value={currentPosition}
						aria-label="Default"
						size="small"
						style={{
							bottom: 0,
							marginTop: "10px",
							width: "80%",
						}}
					/>
					<div
						className="mt-2"
						style={{
							color: "#fff",
							width: "10%",
							fontSize: ".9em",
						}}
					>
						{formatTime(duration)}
					</div>
				</Stack>
			</div>
		</div>
	);
}

export default withStyles(styles, { index: 1 })(PlayerSDK);
