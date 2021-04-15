import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.render(
	<React.StrictMode>
		<App style={{ backgroundColor: "#020101", margin: 0 }} />
	</React.StrictMode>,
	document.getElementById("root")
)
