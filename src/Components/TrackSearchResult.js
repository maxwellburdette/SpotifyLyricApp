import React from "react";
import axios from "axios";
import { Slide } from "@material-ui/core";
export default function TrackSearchResult({
	track,
	chooseTrack,
	currentPlaylist,
	accessToken,
}) {
	function handlePlay() {
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
	return (
		<Slide direction="up" in={true} timeout={300} mountOnEnter unmountOnExit>
			<div
				className="d-flex m-2 align-items-center"
				style={{
					cursor: "pointer",
					backgroundColor: "white",
					borderRadius: "5px",
					overflow: "hidden",
				}}
				onClick={handlePlay}
			>
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
