import React from "react";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Shuffle(params) {
	const spotifyApi = params.spotifyApi;
	function handleClick(e) {
		if (e.target.style.color === "green") {
			e.target.style.color = "white";
			setShuffleMode(false);
			return;
		}

		e.target.style.color = "green";
		setShuffleMode(true);
	}
	function setShuffleMode(bool) {
		spotifyApi.setShuffle(bool).then(
			function () {
				console.log("Shuffle is toggled");
			},
			function (err) {
				//if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
				console.log("Something went wrong!", err);
			}
		);
	}
	return (
		<div className="shuffle  p-2 d-flex justify-content-center align-items-center">
			<div className="my-2">
				<FontAwesomeIcon
					onClick={handleClick}
					style={{ color: "#fff" }}
					icon={["fas", "random"]}
					size="lg"
				/>
			</div>
		</div>
	);
}
