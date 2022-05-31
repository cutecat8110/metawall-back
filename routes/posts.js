const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");
const handleErrorAsync = require("../service/handleErrorAsync");

router.get(
  /*
    #swagger.tags = ['Posts - 貼文']
    #swagger.description = '取得所有貼文'
    #swagger.responses[200] = {
      description: '貼文資訊',
      schema: {
        "status": "success",
        "data": [
          {
            "_id": "6293b29dc213ea2a2264511e",
            "user": {
              "_id": "6284bd0df623a5fcf56630f0",
              "name": "John",
              "photo": "https://thumb.fakeface.rest/thumb_male_10_8c02e4e9bdc0e103530691acfca605f18caf1766.jpg"
            },
            "image": "",
            "content": "123",
            "likes": 0,
            "comments": 0,
            "createdAt": "2022-05-29T17:51:25.670Z"
          }
        ]
      }
    }
   */
  "/",
  handleErrorAsync(postsControllers.getAll)
);
router.delete("/", handleErrorAsync(postsControllers.deleteAll));

module.exports = router;
