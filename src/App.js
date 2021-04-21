import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import { useState } from "react";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");
function App() {
	const [backgroundColor, setBackgroundColor] = useState("");
	return (
		<div
			className="app"
			style={
				backgroundColor
					? {
							transition: '0.5s',
							backgroundImage: backgroundColor
					  }
					: {
							transition: '0.5s',
							backgroundImage: "linear-gradient(rgba(52,52,52,.5), rgba(52,52,52,1)"
					  }
			}
		>
			{code ? (
				<Dashboard
					setBackgroundColor={setBackgroundColor}
					backgroundColor={backgroundColor}
					code={code}
				></Dashboard>
			) : (
				<Login />
			)}
		</div>
	);
}

export default App;
