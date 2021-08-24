import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();
	const loginUrl = process.env.REACT_APP_LOGIN;
	const refreshUrl = process.env.REACT_APP_REFRESH;
	//Switch variable being taken by endpoint when using different environments
	const environment = {
		prod: "prod",
		dev: "dev",
	};

	useEffect(() => {
		axios
			.get(loginUrl, {
				params: {
					code: code,
					env:
						process.env === "production" ? environment.prod : environment.dev,
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
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
				.get(refreshUrl, {
					params: {
						refreshToken: refreshToken,
						env:
							process.env.NODE_ENV === "production"
								? environment.prod
								: environment.dev,
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
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
		// eslint-disable-next-line
	}, [refreshToken, expiresIn]);

	return accessToken;
}
