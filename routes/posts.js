const express = require("express");
const router = express.Router();
const postsCON = require("../controllers/posts");
const postsSpecs = require("../specs/posts");
const { isAuth } = require("../service/auth");

// post 單一
router.post("/post", isAuth, postsCON.create, postsSpecs.create);
router.get(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.getOne,
  postsSpecs.getOne
);
router.patch(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.update,
  postsSpecs.update
);
router.put(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.like,
  postsSpecs.like
);
router.delete(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.deleteOne,
  postsSpecs.deleteOne
);
// posts 所有
router.get("/posts", isAuth, postsCON.getAll, postsSpecs.getAll);
router.delete("/posts", isAuth, postsCON.deleteAll, postsSpecs.deleteAll);

module.exports = router;
