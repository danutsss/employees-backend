const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	description: {
		type: String,
		default: "regular_user",
	},
});

const Permission = mongoose.model("Permission", permissionSchema);
module.epxorts = { Permission };
