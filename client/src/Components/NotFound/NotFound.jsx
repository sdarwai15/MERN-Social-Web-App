import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import "./NotFound.css";

const NotFound = () => {
	return (
		<div className="not-found">
			<div className="gif">
				<img
					src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
					alt="gif"
				/>
			</div>
			<div className="bottom">
				<Typography
					variant="h5"
					style={{ fontFamily: "Arvo", fontSize: "24px" }}
				>
					Looks like you are lost
				</Typography>
				<Typography
					variant="h6"
					style={{ fontFamily: "Arvo", fontSize: "16px" }}
				>
					the page you are looking for is not available!
				</Typography>
			</div>

			<Link to="/" style={{ textDecoration: "none" }}>
				<Button
					variant="contained"
					style={{
						fontFamily: "Arvo",
						boxShadow: " 0 10px 10px rgba(145, 92, 182, 0.197);",
					}}
                    color="info"
				>
					Go to Home
				</Button>
			</Link>
		</div>
	);
};

export default NotFound;
