import React from "react";
import "./queue.css";

export default function Queue(props) {
	function handleClick() {
		props.setToggleQueue((prevState) => !prevState);
	}
	return (
		<div>
			<div onClick={handleClick} className="queueIcon">
				<div className="line play"></div>
				<div className="line"></div>
				<div className="line"></div>
			</div>
			<div className="playButton"></div>
		</div>
	);
}
