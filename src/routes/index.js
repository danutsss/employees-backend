const authentication = require("./authentication");
const comment = require("./comment");
const employee = require("./employee");
const permission = require("./permission");
const shift = require("./shift");

const authMiddleware = require("../middleware/authenticate");

module.exports = (app) => {
	app.get("/", (request, response) => {
		response.status(200).json({
			success: true,
			message: "You are now using Employee Shift Manager API.",
		});
	});

	app.use("/api/v1/auth", authentication);
	app.use("/api/v1/employee", authMiddleware, employee);
	app.use("/api/v1/shift", authMiddleware, shift);
	app.use("/api/v1/comment", authMiddleware, comment);
	app.use("/api/v1/permission", permission);
};
