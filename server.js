const app = require("./app");
const { connectDatabase } = require("./config/database");
const cloudinary = require("cloudinary");

connectDatabase();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

app.listen(process.env.PORT || 4000, () => {
	// console log when server is running
	console.log("server is running at port", process.env.PORT || 4000);
});
