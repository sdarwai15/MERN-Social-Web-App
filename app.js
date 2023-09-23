const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
	// if not in production, set dotenv to load .env file
	require("dotenv").config({ path: "config/.env" });
}

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.resolve(__dirname, "client", "build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

//Using middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//Importing routes
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

//Using routes
app.use("https://social-web-app.onrender.com/posts", postRoutes);
app.use("https://social-web-app.onrender.com/users", userRoutes);

module.exports = app;
