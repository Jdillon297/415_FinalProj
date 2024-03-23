const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { MongoClient } = require("mongodb");
const env = require("dotenv");

const router = require("../router");

function setUpEnvironment() {
  env.config();
  const Environment = {
    connectionString: process.env.connectionString,
    database: process.env.database,
    userCollection: process.env.userCollection,
    postCollection: process.env.postCollection,
    topicCollection: process.env.topicCollection,
  };
  return Environment;
}

function setupCookieParser(app) {
  app.use(cookieParser());
}

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
  setupCookieParser,
  setUpEnvironment,
};
