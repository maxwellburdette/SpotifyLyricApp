import React from "react";
import { Stack } from "react-bootstrap";
import NewSideBar from "./NewSideBar";

export default function NewDashboard() {
	return (
		<div>
			<h1 className="text-lg-center">New Dashboard</h1>
			<Stack direction="horizontal" gap={0}>
				<NewSideBar></NewSideBar>
			</Stack>
		</div>
	);
}
