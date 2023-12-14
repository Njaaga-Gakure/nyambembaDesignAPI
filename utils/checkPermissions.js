const CustomErrors = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  const { role, userId } = requestUser;
  if (role === "admin") return;
  if (userId === resourceUserId.toString()) return;
  throw new CustomErrors.UnauthorizedError(
    "You don't have permission to access this resource"
  );
};

module.exports = checkPermissions;
