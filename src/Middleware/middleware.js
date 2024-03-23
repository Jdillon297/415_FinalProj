const express = require("express");
const bodyParser = require("body-parser");
const router = require("../router");

function setupBodyParser(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}

function setupStaticRoutes(app) {
  // Define static routes based on the routes defined in routes.js

  app.use(express.static(router.loginPath));
  app.use(express.static(router.registerPath));
}

module.exports = {
  setupStaticRoutes,
  setupBodyParser,
};
