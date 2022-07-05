const express = require("express");
const router = express.Router();
const postsCON = require("../controllers/posts");
const postsSpec = require("../specs/post");
const { isAuth } = require("../service/auth");

// post 單一
router.post("/post", isAuth, postsCON.create, postsSpec.create);
router.get(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.getOne,
  postsSpec.getOne
);
router.patch(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.update,
  postsSpec.update
);
router.delete(
  "/post/:id",
  isAuth,
  postsCON.checkPost,
  postsCON.deleteOne,
  postsSpec.deleteOne
);
router.post(
  "/post/:id/likes",
  isAuth,
  postsCON.checkPost,
  postsCON.like,
  postsSpec.like
);
router.delete(
  "/post/:id/likes",
  isAuth,
  postsCON.checkPost,
  postsCON.unlike,
  postsSpec.like
);
router.post(
  "/post/:id/comment",
  isAuth,
  postsCON.checkPost,
  postsCON.comment,
);

// posts 所有
router.get("/posts", isAuth, postsCON.getAll, postsSpec.getAll);
router.delete("/posts", isAuth, postsCON.deleteAll, postsSpec.deleteAll);

module.exports = router;
