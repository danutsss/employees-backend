const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const CORS = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const dotenv = require("dotenv");

// Load environment variables.
dotenv.config();

// Mongoose database options.
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// Connect to MongoDB database.
mongoose
	.connect(process.env.MONGODB_URI, dbOptions)
	.then(() => {
		console.log(
			"[mongoDB]: connected to database, starting application..."
		);

		// Initialize express application.
		const backendApp = express();

		// Add `helmet` to enhance API's security.
		setTimeout(() => {
			console.log("[express]: enhancing API security with `helmet`...");
			backendApp.use(helmet());
		}, 1000);

		// Use `body-parser` to parse JSON bodies into JS objects.
		setTimeout(() => {
			console.log("[express]: parsing JSON bodies with `body-parser`...");
			backendApp.use(bodyParser.json());
			backendApp.use(bodyParser.urlencoded({ extended: true }));
		}, 1500);

		// Use `cookie-parser` to parse cookies.
		setTimeout(() => {
			console.log("[express]: parsing cookies with `cookie-parser`...");
			backendApp.use(cookieParser());
		}, 2000);

		// Enable CORS for all requests.
		setTimeout(() => {
			console.log("[express]: enabling CORS for all requests...");
			backendApp.use(
				CORS({
					credentials: true,
					origin: true,
				})
			);
		}, 2500);

		// Add `morgan` to log HTTP requests.
		setTimeout(() => {
			console.log("[express]: logging HTTP requests with `morgan`...");
			backendApp.use(morgan("combined"));
		}, 3000);

		// Initialize `passport` middleware.
		setTimeout(() => {
			console.log("[express]: initializing `passport` middleware...");
			backendApp.use(passport.initialize());
			require("./middleware/jwt")(passport);
		}, 3500);

		// Add routes.
		setTimeout(() => {
			console.log("[express]: adding routes...");
			// backendApp.use("./routes/index")(backendApp);
		}, 4000);

		// Set debug mode.
		process.env.NODE_ENV === "development"
			? mongoose.set("debug", true)
			: mongoose.set("debug", false);

		setTimeout(() => {
			backendApp.listen(process.env.PORT, () => {
				console.log(
					`[express]: server listening on port ${process.env.PORT}...`
				);
			});
		}, 4500);
	})
	.catch((error) => {
		console.log(
			"[mongoDB]: failed to connect to database, application crashed..."
		);
		console.log(`[mongoDB]: ${error}`);
	});
