const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");

router.get("/", postsControllers.getAll);
router.delete("/", postsControllers.deleteAll);

module.exports = router;
