import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();
	const authUrl = process.env.REACT_APP_LOGIN;
	const redirectUri = process.env.REACT_APP_REDIRECT_URI;

	useEffect(() => {
		axios
			.get(`${authUrl}/login?code=${code}&redirect_uri=${redirectUri}`, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.then((res) => {
				setAccessToken(res.data.access_token);
				setRefreshToken(res.data.refresh_token);
				setExpiresIn(res.data.expires_in);
				window.history.pushState({}, null, "/");
			})
			.catch((err) => {
				window.location = "/";
				//console.log(err);
			});
		// eslint-disable-next-line
	}, [code]);

	useEffect(() => {
		if (!refreshToken || !expiresIn) return;
		const internal = setInterval(() => {
			axios
				.get(`${authUrl}/refresh`, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then((res) => {
					setAccessToken(res.data.access_token);
					setExpiresIn(res.data.expires_in);
				})
				.catch((err) => {
					window.location = "/";
					// console.log(err);
				});
		}, (expiresIn - 60) * 1000);

		return () => clearInterval(internal);
		// eslint-disable-next-line
	}, [refreshToken, expiresIn]);

	return accessToken;
}
