var express = require("express");
const fs = require("fs");
const middleware = require("./Middleware/middleware");
const router = require("./router");

var app = express();

middleware.setupStaticRoutes(app);
middleware.setupBodyParser(app);

app.get("/", function (req, res) {
  res.sendFile(`${pages.login}`);
});

app.get("/register", function (req, res) {
  res.sendFile(`${pages.register}`);
});

app.get("/sporting", function (req, res) {
  res.sendFile(`${pages.sports}`);
});

app.get("/art", function (req, res) {
  res.sendFile(`${pages.arts}`);
});

app.get("/education", function (req, res) {
  res.sendFile(`${pages.education}`);
});

app.post("/post/home", function (req, res) {
  const userId = req.body.user_ID;
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Welcome Back</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" /><style>body {margin: 0;padding: 0;display: static;justify-content: center;align-items: center;flex-direction: column;font-family: Arial, sans-serif;background-color: #f4f4f4;background-image: url("https://i.imgur.com/z2gdihV.png");background-position: center;background-size: cover;}.container {width: 80%;max-width: 600px;margin: 50px auto;text-align: center;background-color: #1a1a1a;padding: 20px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);border: 2px solid #ff5733;color: #fff;}.user-info {margin-top: 20px;}.user-info p {font-size: 18px;}.user-info span {font-weight: bold;color: #007bff;}.carousel-item {text-align: center;}.carousel-item .topic-card {border: 2px solid #ff5733;border-radius: 8px;padding: 20px;width: 80%;background-color: #1a1a1a;color: #fff;transition: border-color 0.3s, color 0.3s, box-shadow 0.3s;}.carousel-item .topic-card:hover {border-color: #ff8c42;box-shadow: 0 0 20px rgba(255, 139, 66, 0.5);color: #ff8c42;}.topic-title {font-weight: bold;}.topic-description {margin-top: 10px;}.carousel-control-prev,.carousel-control-next {color: #ff5733;}</style></head><body><div class="container"><h1 class="mb-4">Welcome Back!</h1><div class="user-info"><p class="mb-2">Welcome, <span id="username">${userId}</span></p><p>Click on a topic to see recent posts. Start Twheating <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-fire" viewBox="0 0 16 16" style="color: #ff5733"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/></svg></p></div></div><div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li><li data-target="#carouselExampleIndicators" data-slide-to="1"></li><li data-target="#carouselExampleIndicators" data-slide-to="2"></li></ol><div class="carousel-inner"><div class="carousel-item active"><a href="/sporting" class="topic-link"><div class="topic-card mx-auto"><div class="topic-image"><img src="https://i.imgur.com/ZfdGqYn.gif" alt="Image" style="width: 50%; max-width: 200px" /></div><div class="topic-title">Epic Sports</div><div class="topic-description">A series of posts on people's favorite sports.</div></div></a></div><div class="carousel-item"><a href="/art" class="topic-link"><div class="topic-card mx-auto"><div class="topic-image"><img src="https://i.imgur.com/MBUKVQ9.jpeg" alt="Image" style="width: 50%; max-width: 200px" /></div><div class="topic-title">Fine Art</div><div class="topic-description">The most up-to-date posts on fine works of art.</div></div></a></div><div class="carousel-item"><a href="/education" class="topic-link"><div class="topic-card mx-auto"><div class="topic-image"><img src="https://i.imgur.com/uGmSNxk.jpeg" alt="Image" style="width: 50%; max-width: 200px" /></div><div class="topic-title">Education</div><div class="topic-description">Cutting-edge comments on new education.</div></div></a></div></div><a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div><script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></body></html>`;

  res.send(html);
});

app.listen(3000);

const pages = {
  login: `${router.loginPath}/login.html`,
  register: `${router.registerPath}/register.html`,
  sports: `${router.topicsPath}/sports.html`,
  arts: `${router.topicsPath}/art.html`,
  education: `${router.topicsPath}/education.html`,
};
