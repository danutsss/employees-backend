const mongoose = require("mongoose");
const bCrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const saltRounds = 10;

const employeeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	emailAddress: {
		type: String,
		unique: true,
		required: "your e-mail address is required.",
		trim: true,
	},
	password: {
		type: String,
		required: "your password is required.",
		trim: true,
	},
	firstName: {
		type: String,
		required: "your first name is required.",
		trim: true,
	},
	lastName: {
		type: String,
		required: "your last name is required.",
		trim: true,
	},
	permissionLevel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Permission",
		default: "regular_user",
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

employeeSchema.pre("save", (next) => {
	const employee = this;

	if (!employee.isModified("password")) return next();

	bCrypt.genSalt(saltRounds, (error, salt) => {
		if (error) return next(error);

		bCrypt.hash(employee.password, salt, (error, hash) => {
			if (error) return next(error);

			employee.password = hash;
			next();
		});
	});
});

employeeSchema.methods.comparePasswords = (plainPassword) => {
	return bCrypt.compareSync(plainPassword, this.password);
};

employeeSchema.methods.generateJWT = () => {
	const today = new Date();
	const expirationDate = new Date(today);

	expirationDate.setDate(today.getDate() + 60);

	let jwtPayload = {
		id: this._id,
		emailAddress: this.emailAddress,
		lastName: this.lastName,
		firstName: this.firstName,
		permissionLevel: this.permissionLevel,
	};

	return JWT.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
	});
};

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = { Employee };
