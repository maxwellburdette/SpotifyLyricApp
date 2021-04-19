import Login from "./Components/Login"
import Dashboard from "./Components/Dashboard"
import { useState } from "react"
import "./App.css"

const code = new URLSearchParams(window.location.search).get("code")
function App() {
	const [backgroundColor, setBackgroundColor] = useState("")
	return (
		<div
			className="app"
			style={
				backgroundColor
					? { background: backgroundColor }
					: { background: "#333" }
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
	)
}

export default App
