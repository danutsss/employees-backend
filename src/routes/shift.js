const express = require("express");

const Shift = require("../controllers/shift");

const apiRouter = express.Router();

// Get all shifts.
apiRouter.get("/", Shift.getAllShifts);

// Get shift by id.
apiRouter.get("/:id", Shift.getShiftById);

// Update shift by id.
apiRouter.put("/:id", Shift.updateShiftById);

// Delete shift by id.
apiRouter.delete("/:id", Shift.deleteShift);

// Create shift.
apiRouter.post("/", Shift.addShift);

module.exports = apiRouter;
