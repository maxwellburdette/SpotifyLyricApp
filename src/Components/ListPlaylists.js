import React from "react";

export default function ListPlaylists(params) {
	const playlists = params.playlists;
	const spotifyApi = params.spotifyApi;
	const track = params.track;
	const setAdded = params.setAdded;
	function handleAdd(e) {
		const id = e.target.id;
		const playlist = playlists[id];
		const playlistId = playlist.id;
		const trackUri = track.uri;

		spotifyApi.addTracksToPlaylist(playlistId, [trackUri]).then(
			function (data) {
				setAdded(true);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);

		params.setShow(false);
	}
	return (
		<div className="my-2" style={{ width: "100%" }}>
			<div className="playlists d-flex justify-content-center flex-wrap">
				{playlists.map((playlist, index) => {
					return (
						<div
							key={index}
							id={index}
							className="playlist py-2"
							onClick={handleAdd}
						>
							{playlist.name}
						</div>
					);
				})}
			</div>
		</div>
	);
}
