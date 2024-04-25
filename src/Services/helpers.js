function get2Posts(postsArray) {
  var twoPosts = [];
  if (postsArray.length >= 1) {
    if (postsArray.length == 1) {
      twoPosts.push(postsArray.pop());
    } else {
      twoPosts.push(postsArray.pop());
      twoPosts.push(postsArray.pop());
    }
  }
  return twoPosts;
}

module.exports = {
  get2Posts,
};
