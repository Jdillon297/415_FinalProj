function duplicateUserCheck(result) {
  if (result === -1) {
    return true;
  }
  return false;
}

function loginErrorCheck(result) {
  if (result === -1) {
    return true;
  }
  return false;
}

function cookieCheck(cookie) {
  if (cookie !== undefined) {
    return true;
  }
  return false;
}

function createTopicCheck(result) {
  if (result === 1) {
    return true;
  }
  return false;
}

module.exports = {
  duplicateUserCheck,
  loginErrorCheck,
  cookieCheck,
  createTopicCheck,
};
