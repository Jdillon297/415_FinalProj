const { query, response } = require("express");
const connection = require("../dataconnection");
const middleware = require("../Middleware/middleware");
const User = require("../Models/users");
const Response = require("../Models/response");
const Topic = require("../Models/topics");
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

async function registerService(user_ID, password) {
  try {
    const instance = connection.getDB();
    var users = instance.collection(env.userCollection);
    const query = { username: user_ID, password: password, subscribed: [] };
    console.log(query);

    const checkForDuplicateQuery = { username: user_ID, password: password };
    const duplicateUser = await users.findOne(checkForDuplicateQuery);

    if (duplicateUser !== null) {
      console.log(duplicateUser);
      return -1;
    }
    await users.insertOne(query);
    return 1;
  } catch (error) {
    console.error(error);
  }
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
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome Back</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"><style>body {margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;flex-direction: column;font-family: Arial, sans-serif;background-color: #f4f4f4;background-image: url("https://i.imgur.com/z2gdihV.png");background-position: center;background-size: cover;}.container {width: 80%;max-width: 600px;margin: 50px auto;text-align: center;background-color: #1a1a1a;padding: 20px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);border: 2px solid #ff5733;color: #fff;}.user-info {margin-top: 20px;}.user-info p {font-size: 18px;}.user-info span {font-weight: bold;color: #007bff;}.btn-option {background-color: #ff5733;border-color: #ff5733;}.btn-option:hover {background-color: #ff8c42;border-color: #ff8c42;}.btn-glowing {animation: glowing 1.5s infinite;}.btn-activity {background-color: #ff5733;border-color: #ff5733;color: #fff;transition: background-color 0.3s, border-color 0.3s;}.btn-activity:hover {background-color: #ff8c42;border-color: #ff8c42;color: #fff;animation: glowing 1.5s infinite;}.@keyframes glowing {0% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}50% {background-color: #ff8c42;box-shadow: 0 0 10px #ff8c42, 0 0 20px #ff8c42, 0 0 40px #ff8c42;}100% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}}.logout-btn {position: fixed;bottom: 20px;right: 20px;}.view-topics-btn {margin-top: 20px;}</style></head><body><div style="display: flex; justify-content: space-between; width: 100%"><div class="gif-container"></div><div class="gif-container"></div></div><div class="container"><h1 class="mb-4">Welcome Back!</h1><div class="user-info"><div><p class="mb-2">Welcome, <span id="username">${user_ID}</span></p></div><p>Click on an option below:</p><div style="display: flex; justify-content: space-evenly"><div><a href="/mytopics"><button class="btn btn-lg btn-option mb-3">View My Topics</button></a></div><div><a href="/createtopic"><button class="btn btn-lg btn-option">Create a Topic</button></a></div></div></div></div><div><a href="/showactivity"><button class="btn btn-lg btn-activity mt-3" id="activityBtn">Show Activity</button></a></div><a href="/logout"><button class="btn btn-danger logout-btn">Logout</button></a><div class="view-topics-btn"><a href="/alltopics"><button class="btn btn-primary">View All Topics</button></a></div><script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></body></html>`;

      return html;
    } else return -1;
  } catch (err) {
    console.error(err);
  }
}

async function createTopicService(title, description) {
  try {
    const instance = connection.getDB();
    const topics = instance.collection(env.topicCollection);

    const query = { title: title, description: description };
    await topics.insertOne(query);

    const response = new Response("ok", "successful", {
      title: title,
      description: description,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}

async function getAllUnsubscribedTopicsService(user_Id) {
  try {
    const instance = connection.getDB();
    const users = instance.collection(env.userCollection);
    const topics = instance.collection(env.topicCollection);
    const foundUser = await users.findOne({ username: user_Id });

    const user = new User(
      foundUser._id,
      foundUser.username,
      foundUser.password,
      foundUser.subscribed
    );

    var subscribedTopics = await user.subscribed;

    console.log(subscribedTopics);

    var allUnSubscribedTopics = await topics.find({}).toArray();
    var intersectedTopics = [];
    for (var i = 0; i < allUnSubscribedTopics.length; i++) {
      var topicFound = false;

      for (var j = 0; j < subscribedTopics.length; j++) {
        if (allUnSubscribedTopics[i].title === subscribedTopics[j].title) {
          topicFound = true;
          break;
        }
      }

      if (!topicFound) {
        intersectedTopics.push(allUnSubscribedTopics[i]);
      }
    }
    console.log(intersectedTopics);
    return intersectedTopics;
  } catch (error) {
    console.error(error);
  }
}

async function getAllPostsService() {
  try {
    const instance = connection.getDB();
    const posts = instance.collection(env.postCollection);
    returnedPosts = await posts.find({}).toArray();
    return returnedPosts;
  } catch (error) {
    return null;
  }
}
async function getAllPostsByTopicNameService(topicName) {
  var postsToReturn = [];
  try {
    const instance = connection.getDB();
    const post = instance.collection(env.postCollection);
    allPosts = await post.find({}).toArray();
    for (var i = 0; i < allPosts.length; i++) {
      if (allPosts[i].topic_name === topicName) {
        console.log(allPosts[i]);
        postsToReturn.push(allPosts[i]);
      }
    }
  } catch (error) {
    return null;
  }
  return postsToReturn;
}

async function subscibeToTopicService(username, topic) {
  try {
    const instance = connection.getDB();
    const usersCollection = instance.collection(env.userCollection);
    const topicsCollection = instance.collection(env.topicCollection);
    const topicToSubscribeTo = await topicsCollection.findOne({ title: topic });

    const lookedUpUser = await usersCollection.findOne({ username: username });
    lookedUpUser.subscribed.push(topicToSubscribeTo);
    const user = mapToUserModel(lookedUpUser);

    // Save the updated user document back to the database
    await usersCollection.updateOne(
      { username: user.username },
      { $set: { subscribed: user.subscribed } }
    );
  } catch (error) {
    console.error(error);
  }
}

async function unsubscribeFromTopicService(username, topic) {
  try {
    const instance = connection.getDB();
    const usersCollection = instance.collection(env.userCollection);
    const user = await usersCollection.findOne({ username: username });
    console.log(topic);
    let topics = user.subscribed.filter((x) => x.title !== topic);
    console.log(topics);
    user.subscribed = topics;
    const modelUser = mapToUserModel(user);
    await usersCollection.updateOne(
      { username: modelUser.username },
      { $set: { subscribed: modelUser.subscribed } }
    );
  } catch (error) {
    console.error(error);
  }
}

async function createPostService(post) {
  try {
    const instance = connection.getDB();
    const postCollection = instance.collection(env.postCollection);
    await postCollection.insertOne(post);
  } catch (error) {
    console.error(error);
  }
}

function getSuccessfulRegisterPageService() {
  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Registration Success</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"><style>body {margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;flex-direction: column;font-family: Arial, sans-serif;background-color: #f4f4f4;background-image: url("https://i.imgur.com/z2gdihV.png");background-position: center;background-size: cover;}.container {width: 80%;max-width: 600px;margin: 50px auto;text-align: center;background-color: #1a1a1a;padding: 20px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);border: 2px solid #ff5733;color: #fff;}.btn-option {background-color: #ff5733;border-color: #ff5733;}.btn-option:hover {background-color: #ff8c42;border-color: #ff8c42;}.logout-btn {position: fixed;bottom: 20px;right: 20px;}.view-topics-btn {margin-top: 20px;}</style></head><body><div class="container"><h1 class="mb-4">Registration Successful!</h1><p>Thank you for registering.</p><p>You are now part of our community.</p><a href="/"><button class="btn btn-lg btn-option">Login</button></a></div><script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></body></html>';
  return html;
}

function getHomePageService(user_ID) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Back</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <style>body {margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;flex-direction: column;font-family: Arial, sans-serif;background-color: #f4f4f4;background-image: url("https://i.imgur.com/z2gdihV.png");background-position: center;background-size: cover;}.container {width: 80%;max-width: 600px;margin: 50px auto;text-align: center;background-color: #1a1a1a;padding: 20px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);border: 2px solid #ff5733;color: #fff;}.user-info {margin-top: 20px;}.user-info p {font-size: 18px;}.user-info span {font-weight: bold;color: #007bff;}.btn-option {background-color: #ff5733;border-color: #ff5733;}.btn-option:hover {background-color: #ff8c42;border-color: #ff8c42;}.btn-glowing {animation: glowing 1.5s infinite;}.btn-activity {background-color: #ff5733;border-color: #ff5733;color: #fff;transition: background-color 0.3s, border-color 0.3s;}.btn-activity:hover {background-color: #ff8c42;border-color: #ff8c42;color: #fff;animation: glowing 1.5s infinite;}.@keyframes glowing {0% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}50% {background-color: #ff8c42;box-shadow: 0 0 10px #ff8c42, 0 0 20px #ff8c42, 0 0 40px #ff8c42;}100% {background-color: #ff5733;box-shadow: 0 0 10px #ff5733, 0 0 20px #ff5733, 0 0 40px #ff5733;}}.logout-btn {position: fixed;bottom: 20px;right: 20px;}.view-topics-btn {margin-top: 20px;}</style>
  </head><body><div style="display: flex; justify-content: space-between; width: 100%"><div class="gif-container"></div><div class="gif-container"></div></div><div class="container"><h1 class="mb-4">Welcome Back!</h1><div class="user-info"><div><p class="mb-2">Welcome, <span id="username">${user_ID}</span></p></div>
  <p>Click on an option below:</p><div style="display: flex; justify-content: space-evenly"><div><a href="/mytopics"><button class="btn btn-lg btn-option mb-3">View My Topics</button></a></div><div><a href="/createtopic"><button class="btn btn-lg btn-option">Create a Topic</button></a></div></div></div></div><div><a href="/activity"><button class="btn btn-lg btn-activity mt-3" id="activityBtn">Activity</button></a></div><a href="/logout"><button class="btn btn-danger logout-btn">Logout</button></a><div class="view-topics-btn"><a href="/alltopics"><button class="btn btn-primary">View All Topics</button></a></div>
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script></body></html>`;

  return html;
}

function mapToUserModel(lookedUpUser) {
  const user = new User(
    lookedUpUser._id,
    lookedUpUser.username,
    lookedUpUser.password,
    lookedUpUser.subscribed
  );
  return user;
}
function mapToTopicModel(topic) {
  const model = new Topic(topic._id, topic.name, topic.description);
  return model;
}

module.exports = {
  myTopicsService,
  loginService,
  registerService,
  getHomePageService,
  createTopicService,
  getAllUnsubscribedTopicsService,
  getAllPostsService,
  getAllPostsByTopicNameService,
  createPostService,
  subscibeToTopicService,
  unsubscribeFromTopicService,
  getSuccessfulRegisterPageService,
};
