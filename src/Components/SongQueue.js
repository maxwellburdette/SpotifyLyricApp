import React, { useState } from "react";
import Queue from "../Icons/Queue";
import axios from "axios";
export default function SongQueue({ setToggleQueue }) {
	return (
		<>
			<Queue setToggleQueue={setToggleQueue}></Queue>
		</>
	);
}
