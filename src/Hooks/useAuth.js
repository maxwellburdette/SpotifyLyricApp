import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	useEffect(() => {
		axios
			.get(
				"https://us-central1-triple-odyssey-298019.cloudfunctions.net/login",
				{
					params: {
						code: code,
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			)
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				window.history.pushState({}, null, "/");
			})
			.catch((err) => {
				window.location = "/";
				// console.log(err);
			});
	}, [code]);

	useEffect(() => {
		if (!refreshToken || !expiresIn) return;
		const internal = setInterval(() => {
			axios
				.get(
					"https://us-central1-triple-odyssey-298019.cloudfunctions.net/login",
					{
						params: {
							refreshToken: refreshToken,
						},
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				.then((res) => {
					setAccessToken(res.data.accessToken);
					setExpiresIn(res.data.expiresIn);
				})
				.catch((err) => {
					window.location = "/";
					// console.log(err);
				});
		}, (expiresIn - 60) * 1000);
		return () => clearInterval(internal);
	}, [refreshToken, expiresIn]);

	return accessToken;
}
