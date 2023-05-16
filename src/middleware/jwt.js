const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;

const { Employee } = require("../models/Employee");

const jwtOptions = {
	jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
	passport.use(
		new jwtStrategy(jwtOptions, async (jwtPayload, done) => {
			try {
				const employee = await Employee.findById(jwtPayload.id);

				if (!employee) return done(null, false);

				return done(null, employee);
			} catch (error) {
				console.log("[passport]: error authenticating user...");
				console.log(`[passport]: ${error}`);

				return done(error, false, {
					message: "error authenticating user...",
					error: error,
				});
			}
		})
	);
};
