const CustomErrors = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    throw new CustomErrors.UnauthenticatedError("Authentication failed");
  }
  try {
    const { userId, name, role } = isTokenValid(token);
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new CustomErrors.UnauthenticatedError("Authentication failed");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new CustomErrors.UnauthorizedError("Unauthorized user");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
