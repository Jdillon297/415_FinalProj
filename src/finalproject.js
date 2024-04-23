var express = require("express");
const middleware = require("./Middleware/middleware");
const router = require("./router");
const services = require("./Services/services");
const checks = require("./Services/checks");
const PostModel = require("./Models/post");
const Response = require("../src/Models/response");
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

app.get("/activity", function (req, res) {
  res.sendFile(pages.activity);
});

app.get("/activity/user", async function (req, res) {
  const cookie = req.cookies.name;
  var postsArray = await services.myActivityService(cookie);
  res.json({ postsArray });
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
app.get("/myTopicsPosts", async function (req, res) {
  res.sendFile(pages.myTopicsPosts);
});
app.get("/logout", async function (req, res) {
  const cookie = req.cookies.name;
  res.cookie("name", cookie, { maxAge: -1 });
  res.sendFile(pages.login);
});

app.post("/post/myTopicsPosts", async function (req, res) {
  const postName = req.body.title;
  console.log(postName);
  res.send(postName);
});

app.post("/post/Posts", async function (req, res) {
  const topic_name = req.body.title;
  const topicsPosts = await services.getAllPostsByTopicNameService(topic_name);
  res.json(topicsPosts);
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

app.post("/post/subscribe", async function (req, res) {
  const topic_name = req.body.title;
  const username = req.cookies.name;
  console.log(topic_name);
  await services.subscibeToTopicService(username, topic_name);
  res.sendStatus(200);
});

app.post("/post/unsubscribe", async function (req, res) {
  const topic_name = req.body.title;
  const username = req.cookies.name;
  console.log(topic_name);
  await services.unsubscribeFromTopicService(username, topic_name);
  res.sendStatus(200);
});

app.post("/post/createPost", async function (req, res) {
  const postContent = req.body.Description;
  const topic_name = req.body.topic;
  const username = req.cookies.name;
  const Post = new PostModel(postContent, topic_name, username);
  await services.createPostService(Post);
  const response = new Response("ok", "Successful", 200);
  res.send(response);
});

app.post("/post/register", async function (req, res) {
  const userId = req.body.user_ID;
  const password = req.body.password;
  const result = await services.registerService(userId, password);

  if (checks.duplicateUserCheck(result)) {
    res.sendFile(pages.errorRegister);
  } else {
    res.send(services.getSuccessfulRegisterPageService());
  }
});

app.post("/post/createTopic", async function (req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const cookie = req.cookies.name;
  const response = await services.createTopicService(title, description);
  await services.subscibeToTopicService(cookie, title);
  res.json(response);
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
  activity: `${router.topicsPath}/activity.html`,
  alltopics: `${router.topicsPath}/alltopics.html`,
  myTopicsPosts: `${router.postsPath}/myTopicsPosts.html`,
  notFound404: `${router.errorPath}/pageNotFound.html`,
  errorRegister: `${router.errorPath}/registerError.html`,
  errorLogin: `${router.errorPath}/loginError.html`,
};
