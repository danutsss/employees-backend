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
		console.log("[express]: enhancing API security with `helmet`...");
		backendApp.use(helmet());

		// Use `body-parser` to parse JSON bodies into JS objects.
		console.log("[express]: parsing JSON bodies with `body-parser`...");
		backendApp.use(bodyParser.json());
		backendApp.use(bodyParser.urlencoded({ extended: true }));

		// Use `cookie-parser` to parse cookies.
		console.log("[express]: parsing cookies with `cookie-parser`...");
		backendApp.use(cookieParser());

		// Enable CORS for all requests.
		console.log("[express]: enabling CORS for all requests...");
		backendApp.use(
			CORS({
				credentials: true,
				origin: true,
			})
		);

		// Add `morgan` to log HTTP requests.
		console.log("[express]: logging HTTP requests with `morgan`...");
		backendApp.use(morgan("combined"));

		// Initialize `passport` middleware.
		console.log("[express]: initializing `passport` middleware...");
		backendApp.use(passport.initialize());
		require("./middleware/jwt")(passport);

		// Add routes.
		console.log("[express]: adding routes...");
		backendApp.use("./routes/index")(backendApp);

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
		}, 2000);
	})
	.catch((error) => {
		console.log(
			"[mongoDB]: failed to connect to database, application crashed..."
		);
		console.log(`[mongoDB]: ${error}`);
	});
