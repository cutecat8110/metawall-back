const posts = {
  getAll: () => {
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
  },
  create: () => {
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
  },
  deleteAll: () => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     */
  },
  getOne: () => {
    /*
    #swagger.tags = ['Posts - 貼文']
    $swagger.parameters['id'] ={
      in: 'path',
      type: 'string',
      required: true
    }
   */
  },
  deleteOne: () => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     */
  },
  update: () => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     */
  },
  like: () => {
    /**
     * #swagger.tags = ['Posts - 貼文']
     */
  },
};

module.exports = posts;
