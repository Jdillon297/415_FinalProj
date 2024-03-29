const path = require("path");
const routes = require("./Paths/paths");

const router = {
  loginPath: path.join(__dirname, routes.login),
  registerPath: path.join(__dirname, routes.register),
  topicsPath: path.join(__dirname, routes.topics),
  errorPath: path.join(__dirname, routes.errors),
};

module.exports = router;
