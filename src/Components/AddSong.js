import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ListPlaylists from "./ListPlaylists";
import "../Styles/Add.css";
export default function AddSong(params) {
	const [show, setShow] = useState(false);
	const setSongAdded = params.setSongAdded;

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<div className="position-relative">
			<button className="button" onClick={handleShow}>
				Add to playlist
			</button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header
					style={{
						background: "rgba(52,52,52,.5)",
					}}
					closeButton
				>
					<Modal.Title
						style={{
							color: "#fff",
						}}
					>
						Adding:{" "}
						{params.addSong !== undefined
							? params.addSong.name || params.addSong.title
							: ""}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{
						background: "linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)",
						overflowY: "auto",
						height: "500px",
					}}
					className="d-flex justify-content-center"
				>
					<ListPlaylists
						playlists={params.playlists}
						spotifyApi={params.spotifyApi}
						setShow={setShow}
						track={params.addSong}
						setAdded={setSongAdded}
					></ListPlaylists>
				</Modal.Body>
				<Modal.Footer
					style={{
						background: "rgba(52,52,52,1)",
					}}
				>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
