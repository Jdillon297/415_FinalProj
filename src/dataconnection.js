const { MongoClient } = require("mongodb");
const middleware = require("./Middleware/middleware");
const env = middleware.setUpEnvironment();

class Database {
  constructor() {
    if (!Database.instance) {
      this.url = env.connectionString; // Your MongoDB connection URL
      this.dbName = env.database; // Your MongoDB database name
      this.client = new MongoClient(this.url);
      Database.instance = this;
    }

    return Database.instance;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  getDB() {
    return this.db;
  }
}

module.exports = Database.getInstance();
