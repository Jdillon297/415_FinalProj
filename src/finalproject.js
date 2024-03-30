var express = require("express");
const middleware = require("./Middleware/middleware");
const router = require("./router");
const services = require("./Services/services");
const checks = require("./Services/checks");
var app = express();

middleware.setupStaticRoutes(app);
middleware.setupBodyParser(app);
middleware.setupCookieParser(app);

app.get("/", function (req, res) {
  const cookie = req.cookies.name;
  if (checks.cookieCheck(cookie)) {
    const html = services.getHomePageService(cookie);
    res.send(html);
  }
  res.sendFile(pages.login);
});

app.get("/register", function (req, res) {
  res.sendFile(pages.register);
});
app.get("/showactivity", function (req, res) {
  res.sendFile(pages.showactivity);
});

app.get("/mytopics", function (req, res) {
  res.sendFile(pages.mytopics);
});

app.get("/mytopics/user", async function (req, res) {
  const cookie = req.cookies.name;
  var subscriptions = await services.myTopicsService(cookie);
  res.json({ subscriptions });
});

app.get("/createtopic", function (req, res) {
  res.sendFile(pages.createtopic);
});

app.get("/alltopics", function (req, res) {
  res.sendFile(pages.alltopics);
});

app.get("/show/alltopics", async function (req, res) {
  const userId = req.cookies.name;
  var topics = await services.getAllUnsubscribedTopicsService(userId);
  res.json(topics);
});

app.post("/post/home", async function (req, res) {
  const userId = req.body.user_ID;
  const password = req.body.password;
  var result = await services.loginService(userId, password);
  if (checks.loginErrorCheck(result)) {
    res.sendFile(pages.errorLogin);
  } else {
    res.cookie("name", userId, { maxAge: 500000 });
    res.send(result);
  }
});

app.post("/post/register", async function (req, res) {
  const userId = req.body.user_ID;
  const password = req.body.password;
  const result = await services.registerService(userId, password);

  if (checks.duplicateUserCheck(result)) {
    res.sendFile(pages.errorRegister);
  } else {
    res.send("Registered Successfully: " + userId);
  }
});

app.post("/post/createTopic", async function (req, res) {
  const title = req.body.title;
  const description = req.body.description;
  await services.createTopicService(title, description);
});

app.get("*", function (req, res) {
  res.status(404).sendFile(pages.notFound404);
});

app.listen(3000);

const pages = {
  login: `${router.loginPath}/login.html`,
  register: `${router.registerPath}/register.html`,
  mytopics: `${router.topicsPath}/mytopics.html`,
  createtopic: `${router.topicsPath}/createtopic.html`,
  showactivity: `${router.topicsPath}/showactivity.html`,
  alltopics: `${router.topicsPath}/alltopics.html`,
  notFound404: `${router.errorPath}/pageNotFound.html`,
  errorRegister: `${router.errorPath}/registerError.html`,
  errorLogin: `${router.errorPath}/loginError.html`,
};
