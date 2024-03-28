const connection = require("../dataconnection");
const middleware = require("../Middleware/middleware");
const User = require("../Models/users");
const env = middleware.setUpEnvironment();

connection.connect();

async function myTopicsService(cookie) {
  const db = connection.getDB();
  const collection = db.collection(env.userCollection);
  const username = cookie;
  const data = await collection.findOne({ username: username });
  console.log(data);

  const user = new User(
    data._id,
    data.username,
    data.password,
    data.subscribed
  );
  const subscriptions = await user.subscribed;
  return subscriptions;
}

async function loginService(user_ID, password) {
  try {
    const instance = connection.getDB();

    var users = instance.collection(env.userCollection);
    const query = { username: user_ID, password: password };
    console.log(query);
    const user = await users.findOne(query);
    if (user !== null) {
      console.log(user);
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Welcome Back</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" /><style>body {margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;flex-direction: column;font-family: Arial, sans-serif;background-color: #f4f4f4;background-image: url("https://i.imgur.com/z2gdihV.png");background-position: center;background-size: cover;}.container {width: 80%;max-width: 600px;margin: 50px auto;text-align: center;background-color: #1a1a1a;padding: 20px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);border: 2px solid #ff5733;color: #fff;}.gif-container {background-image: url("https://i.imgur.com/6qJMbna.gif");height: 80px;width: 60px;border-radius: 20px;background-size: cover;background-position: center;}.user-info {margin-top: 20px;}.user-info p {font-size: 18px;}.user-info span {font-weight: bold;color: #007bff;}.btn-option {background-color: #ff5733;border-color: #ff5733;}.btn-option:hover {background-color: #ff8c42;border-color: #ff8c42;}.@keyframes glowing {0% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}50% {background-color: #ff8c42;box-shadow: 0 0 10px #ff8c42, 0 0 20px #ff8c42, 0 0 40px #ff8c42;}100% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}}.btn-glowing {animation: glowing 1.5s infinite;}.btn-activity {background-color: #ff5733;border-color: #ff5733;color: #fff;transition: background-color 0.3s, border-color 0.3s;}.btn-activity:hover {background-color: #ff8c42;border-color: #ff8c42;color: #fff;animation: glowing 1.5s infinite;}</style></head><body><div style="display: flex; justify-content: space-between; width: 100%"><div class="gif-container"></div><div class="gif-container"></div></div><div class="container"><h1 class="mb-4">Welcome Back!</h1><div class="user-info"><div><p class="mb-2">Welcome, <span id="username">${user_ID}</span></p></div><p>Click on an option below:</p><div style="display: flex; justify-content: space-evenly"><div><a href="/mytopics"><button class="btn btn-lg btn-option mb-3">View My Topics</button></a></div><div><a href="/createtopic"><button class="btn btn-lg btn-option">Create a Topic</button></a></div></div></div></div><div><a href="/showactivity"><button class="btn btn-lg btn-activity mt-3" id="activityBtn">Show Activity</button></a></div><script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></body></html>`;
      return html;
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  myTopicsService,
  loginService,
};