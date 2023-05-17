const express = require("express");

const Permission = require("../controllers/permission");

const apiRouter = express.Router();

// Get all permissions.
apiRouter.get("/", Permission.getAllPermissions);

module.exports = apiRouter;
