const express = require("express");
const router = express.Router();
const postsControllers = require("../controllers/posts");
const handleErrorAsync = require("../service/handleErrorAsync");

router.post(
  /*
    #swagger.tags = ['Posts - 貼文']
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      description: '資料格式',
      required: true,
      schema: {
        $user: '6284bd0df623a5fcf56630f0',
        $content: '這是一段話',
        image: '',
      }
    }
    #swagger.responses[200] = {
      description: '貼文資訊',
      schema: {
        "status": "success",
        "data": {
          "user": "6284bd0df623a5fcf56630f0",
          "image": "",
          "content": "這是一段話",
          "likes": 0,
          "comments": 0,
          "_id": "6295e0f362a9aa864d5746a4",
          "createdAt": "2022-05-31T09:33:39.656Z"
        }
      }
    }
   */
  "/",
  handleErrorAsync(postsControllers.create)
);
router.get(
  /*
    #swagger.tags = ['Posts - 貼文']
    $swagger.parameters['id'] ={
      in: 'path',
      type: 'string',
      required: true
    }
   */
  "/:id",
  handleErrorAsync(postsControllers.getOne)
);
router.patch(
  /**
   * #swagger.tags = ['Posts - 貼文']
   */
  "/:id",
  handleErrorAsync(postsControllers.update)
);
router.delete(
  /**
   * #swagger.tags = ['Posts - 貼文']
   */
  "/:id",
  handleErrorAsync(postsControllers.deleteOne)
);

module.exports = router;
