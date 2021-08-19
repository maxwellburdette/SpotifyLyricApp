import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../Styles/Add.css";
export default function AddSong(params) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<div>
			<button class="button" onClick={handleShow}>
				Add to playlist
			</button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						{params.addSong !== undefined ? params.addSong.name : ""}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>List of playlists will go here</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
