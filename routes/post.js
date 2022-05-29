const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");

router.post("/", postsControllers.create);
router.get("/:id", postsControllers.getOne);
router.patch("/:id", postsControllers.update);
router.delete("/:id", postsControllers.deleteOne);

module.exports = router;
