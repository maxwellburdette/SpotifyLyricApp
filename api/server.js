require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

<<<<<<< HEAD
const app = express()
app.use(cors())
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true
	})
)

app.post("/refresh", (req, res) => {
	const refreshToken = req.body.refreshToken
	console.log(refreshToken)
	const spotifyApi = new SpotifyWebApi({
		redirectUri: "http://localhost:3000",
		clientId: "6f1aee81690d4ed7a9ea151f597c4fd1",
		clientSecret: "32a8b1dc83b94672842e8eb8f9759c30",
		refreshToken
	})
=======
const app = express();
var router = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

router.use((request, response, next) => {
  console.log('middleware');
  next();
})

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })
>>>>>>> 63cd8c86cc9b675080aea18821b88bfa1dc267fc

	spotifyApi
		.refreshAccessToken()
		.then(data => {
			res.json({
				accessToken: data.body.accessToken,
				expiresIn: data.body.expiresIn
			})
		})
		.catch(err => {
			console.log(err)
			res.sendStatus(400)
		})
})

<<<<<<< HEAD
app.post("/login", (req, res) => {
	const code = req.body.code
	const spotifyApi = new SpotifyWebApi({
		clientId: "6f1aee81690d4ed7a9ea151f597c4fd1",
		clientSecret: "32a8b1dc83b94672842e8eb8f9759c30",
		redirectUri: "http://localhost:3000"
	})
=======
router.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
>>>>>>> 63cd8c86cc9b675080aea18821b88bfa1dc267fc

	spotifyApi
		.authorizationCodeGrant(code)
		.then(data => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in
			})
		})
		.catch(err => {
			res.sendStatus(400)
			//console.log(err)
		})
})

<<<<<<< HEAD
app.get("/lyrics", async (req, res) => {
	const lyrics =
		(await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
	res.json({ lyrics })
})

var port = process.env.PORT || 3001
app.listen(port)
=======
router.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Found";
  res.json({ lyrics });
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log("User API is running at " + 'http://localhost:' +  port);
>>>>>>> 63cd8c86cc9b675080aea18821b88bfa1dc267fc
