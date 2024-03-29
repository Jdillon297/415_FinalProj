class User {
  constructor(id, username, password, subscribed) {
    this._id = id;
    this.username = username;
    this.password = password;
    this.subscribed = subscribed || [];
  }

  // Method to add a subscription
  addSubscription(topic) {
    this.subscribed.push(topic);
  }

  // Method to remove a subscription
  removeSubscription(topic) {
    const index = this.subscribed.indexOf(topic);
    if (index !== -1) {
      this.subscribed.splice(index, 1);
    }
  }

  // Method to check if user is subscribed to a topic
  isSubscribed(topic) {
    return this.subscribed.includes(topic);
  }

  // Method to update user information
  updateUserInfo(username, password) {
    this.username = username;
    this.password = password;
  }
}

module.exports = User;
