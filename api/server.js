require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.post("/refresh", (req, res) => {
	const refreshToken = req.body.refreshToken;
	console.log(refreshToken);
	const spotifyApi = new SpotifyWebApi({
		redirectUri: "http://localhost:3000",
		clientId: "6f1aee81690d4ed7a9ea151f597c4fd1",
		clientSecret: "32a8b1dc83b94672842e8eb8f9759c30",
		refreshToken,
	});

	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken: data.body.accessToken,
				expiresIn: data.body.expiresIn,
			});
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

app.post("/login", (req, res) => {
	const code = req.body.code;
	const spotifyApi = new SpotifyWebApi({
		clientId: "6f1aee81690d4ed7a9ea151f597c4fd1",
		clientSecret: "32a8b1dc83b94672842e8eb8f9759c30",
		redirectUri: "http://localhost:3000",
	});

	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			res.sendStatus(400);
			//console.log(err)
		});
});

app.get("/lyrics", async (req, res) => {
	const lyrics =
		(await lyricsFinder(req.query.artist, req.query.track)) ||
		"No Lyrics Found";
	res.json({ lyrics });
});

app.get("/color", async (req, res) => {});

var port = process.env.PORT || 3001;
app.listen(port);
