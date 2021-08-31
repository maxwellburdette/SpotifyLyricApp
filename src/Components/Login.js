import React from "react";
import { Container } from "react-bootstrap";
const AUTH_URL = process.env.REACT_APP_AUTH_URL || process.env.AUTH_URL;
export default function Login() {
	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh" }}
		>
			<a className="btn btn-success btn-large" href={AUTH_URL}>
				Login With Spotify
			</a>
		</Container>
	);
}
