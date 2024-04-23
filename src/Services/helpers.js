function get2Posts(postsArray) {
  var twoPosts = [];
  if (postsArray.length > 0) {
    for (var i = 0; i < 2; i++) {
      twoPosts.push(postsArray.pop());
    }
  }
  return twoPosts;
}

module.exports = {
  get2Posts,
};
