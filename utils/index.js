const { createToken, isTokenValid, attachCookieToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");

module.exports = {
  createToken,
  isTokenValid,
  attachCookieToResponse,
  createTokenUser,
  checkPermissions,
};
