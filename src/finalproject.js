var express = require("express");
const middleware = require("./Middleware/middleware");
const router = require("./router");
const services = require("./Services/services");

var app = express();

middleware.setupStaticRoutes(app);
middleware.setupBodyParser(app);
middleware.setupCookieParser(app);

app.get("/", function (req, res) {
  res.sendFile(`${pages.login}`);
});
app.get("/register", function (req, res) {
  res.sendFile(`${pages.register}`);
});
app.get("/showactivity", function (req, res) {
  res.sendFile(`${pages.showactivity}`);
});

app.get("/mytopics", function (req, res) {
  res.sendFile(`${pages.mytopics}`);
});

app.get("/mytopics/user", async function (req, res) {
  const cookie = req.cookies.name;
  var subscriptions = await services.myTopicsService(cookie);
  res.json({ subscriptions });
});

app.get("/createtopic", function (req, res) {
  res.sendFile(`${pages.createtopic}`);
});

app.get("/education", function (req, res) {
  res.sendFile(`${pages.education}`);
});

app.post("/post/home", async function (req, res) {
  const userId = req.body.user_ID;
  const password = req.body.password;
  try {
    var html = await services.loginService(userId, password);
    res.cookie("name", userId, { maxAge: 500000 });
    res.send(html);
  } catch (error) {
    res.send(error);
  }
});

app.post("/post/register", async function (req, res) {
  const userId = req.body.user_ID;
  const password = req.body.password;
  try {
    await services.registerService(userId, password);
    res.send("Registered Successfully: " + userId);
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000);

const pages = {
  login: `${router.loginPath}/login.html`,
  register: `${router.registerPath}/register.html`,
  mytopics: `${router.topicsPath}/mytopics.html`,
  createtopic: `${router.topicsPath}/createtopic.html`,
  showactivity: `${router.topicsPath}/showactivity.html`,
};
