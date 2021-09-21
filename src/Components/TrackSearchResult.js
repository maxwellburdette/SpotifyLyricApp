import React, { useState, useEffect } from "react";
import axios from "axios";
import { Slide, Fade } from "@material-ui/core";
import { Button } from "react-bootstrap";
export default function TrackSearchResult({
	track,
	chooseTrack,
	currentPlaylist,
	accessToken,
	setRefs,
	contextOff,
}) {
	const [context, setContext] = useState(false);
	function handlePlay() {
		if (context) return;
		chooseTrack(track);
		//Make case for when there is no playlist to play from
		let data;
		if (!currentPlaylist) {
			data = JSON.stringify({
				context_uri: track.albumUri,
				offset: {
					uri: track.uri,
				},
				position_ms: 0,
			});
		} else {
			data = JSON.stringify({
				context_uri: currentPlaylist,
				offset: { uri: track.uri },
				position_ms: 0,
			});
		}

		var config = {
			method: "put",
			url: "https://api.spotify.com/v1/me/player/play",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
			data: data,
		};

		axios(config)
			.then(function (response) {
				//console.log(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	function rightClick(e) {
		e.preventDefault();
		contextOff();
		setContext(!context);
	}
	function addToQueue() {
		setContext(!context);
		var config = {
			method: "post",
			url: `https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
		};
		axios(config)
			.then(function (response) {
				//console.log(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	function turnOffContext() {
		setContext(false);
	}
	useEffect(() => {
		setRefs(turnOffContext);
	}, []);
	return (
		<Slide direction="up" in={true} out={false} timeout={300}>
			<div
				className="d-flex m-2 align-items-center position-relative"
				style={{
					cursor: "pointer",
					backgroundColor: "white",
					borderRadius: "5px",
					overflow: "hidden",
					// pointerEvents: context ? "none" : "",
				}}
				onClick={handlePlay}
				onContextMenu={rightClick}
			>
				<Slide
					direction="right"
					in={context}
					exit={!context}
					mountOnEnter
					unmountOnExit
				>
					<div
						className="d-flex justify-content-center align-items-center position-absolute"
						style={{
							backgroundColor: "#111",
							width: "50%",
							height: "100px",
							position: "relative",
							zIndex: 1000,
							// pointerEvents: context ? "none" : "",
						}}
					>
						<Fade in={context}>
							<Button onClick={addToQueue} className="btn-success">
								Add to Queue
							</Button>
						</Fade>
					</div>
				</Slide>

				<img
					src={track.albumUrl}
					alt=""
					style={{ height: "64px", width: "64px" }}
				/>
				<div className="ml-3 ">
					<div>{track.title}</div>
					<div className="text-muted" style={{ fontWeight: "300" }}>
						{track.artist}
					</div>
				</div>
			</div>
		</Slide>
	);
}
