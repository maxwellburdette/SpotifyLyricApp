import React, { Component } from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
	"https://accounts.spotify.com/authorize?client_id=6f1aee81690d4ed7a9ea151f597c4fd1&response_type=code&redirect_uri=https://triple-odyssey-298019.uc.r.appspot.com&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
// const AUTH_URL_DEV =
// 	"https://accounts.spotify.com/authorize?client_id=feefed53e1d04680b68cd8d9cc1f6e40&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
class Login extends Component {
	render() {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ minHeight: "100vh" }}
			>
				{/** For running in development environment */}

				{/* <a className="btn btn-success btn-large" href={AUTH_URL_DEV}>
					Login With Spotify
				</a> */}

				{/* For running in production environment */}
				<a className="btn btn-success btn-large" href={AUTH_URL}>
					Login With Spotify
				</a>
			</Container>
		);
	}
}

export default Login;
