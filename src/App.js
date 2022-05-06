import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import React, { useState, useRef, useEffect } from "react";
import { Fade } from "@material-ui/core";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
	const [backgroundColor, setBackgroundColor] = useState("");
	const appRef = useRef();
	const [transition, setTransition] = useState(true);
	useEffect(
		() => {
			if (!backgroundColor) return;
			setTransition(!transition);
		},
		//eslint-disable-next-line
		[backgroundColor]
	);

	return (
		<Fade in={true}>
			<div
				ref={appRef}
				className="app backgroundElement"
				style={
					backgroundColor
						? {
								transition: "0.5s",
								backgroundImage: backgroundColor,
						  }
						: {
								transition: "0.5s",
								backgroundImage:
									"linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)",
						  }
				}
			>
				{code ? (
					<Dashboard
						style={{ padding: "0 !important", margin: "0 !important" }}
						setBackgroundColor={setBackgroundColor}
						backgroundColor={backgroundColor}
						code={code}
					></Dashboard>
				) : (
					<Login />
				)}
			</div>
		</Fade>
	);
}

export default App;
