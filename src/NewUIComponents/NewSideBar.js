import React, { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import "./styles.css";

export default function NewSideBar() {
	const listItemRef = useRef();
	useEffect(() => {
		console.log(listItemRef.current);
	}, []);

	return (
		<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			<nav aria-label="main mailbox folders">
				<List className="list">
					<ListItem disablePadding>
						<ListItemButton className="list-item">
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary="Inbox" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							ref={listItemRef}
							selected={true}
							className="list-item"
						>
							<ListItemIcon>
								<DraftsIcon />
							</ListItemIcon>
							<ListItemText primary="Drafts" />
						</ListItemButton>
					</ListItem>
				</List>
			</nav>
			<Divider />
			<nav aria-label="secondary mailbox folders">
				<h3
					className="pt-2 pl-1 font-size-1"
					style={{ color: "#fff", background: "#111" }}
				>
					Playlists
				</h3>
				<Divider />
				<List className="list">
					<ListItem className="list-item" disablePadding>
						<ListItemButton>
							<ListItemText primary="Trash" />
						</ListItemButton>
					</ListItem>
					<ListItem className="list-item" disablePadding>
						<ListItemButton href="#simple-list">
							<ListItemText primary="Spam" />
						</ListItemButton>
					</ListItem>
				</List>
			</nav>
		</Box>
	);
}
