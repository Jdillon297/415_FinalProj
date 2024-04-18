class response {
  constructor(status, message, data) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

module.exports = response;
