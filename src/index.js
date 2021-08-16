import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

ReactDOM.render(
	<React.StrictMode>
		<App style={{ backgroundColor: "#020101", margin: 0 }} />
	</React.StrictMode>,
	document.getElementById("root")
);
