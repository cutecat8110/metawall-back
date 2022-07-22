const posts = {
  create: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '新增貼文'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["body"] = {
      in: 'body',
      type: 'object',
      description: '資料格式',
      required: true,
      schema: {
        $content: "測試",
        image: "",
      }
    };
    #swagger.responses[201] = {
      schema: {
        status: "success",
        message: "貼文已創建",
        post: {
          user: "62d8b0456f6829d341ffa6b5",
          image: "",
          content: "測試",
          likes: [],
          _id: "62da10ba466951791dfb2d1a",
          createdAt: "2022-07-22T02:51:38.102Z",
        },
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  getOne: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '取得單一貼文'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "Post ID",
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        post: {
          _id: "62da10ba466951791dfb2d1a",
          user: {
            _id: "62d8b0456f6829d341ffa6b5",
            name: "小貓咪船長",
            photo: "https://i.imgur.com/PjN4yOu.png",
          },
          image: "",
          content: "測試",
          likes: [],
          createdAt: "2022-07-22T02:51:38.102Z",
          comments: [],
        },
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  like: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '按讚'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "Post ID",
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "已按讚",
        postId: "62da10ba466951791dfb2d1a",
        userId: "62d8b0456f6829d341ffa6b5",
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  unlike: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '取消按讚'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "Post ID",
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "已取消按讚",
        postId: "62da10ba466951791dfb2d1a",
        userId: "62d8b0456f6829d341ffa6b5",
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  comment: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '留言'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "Post ID",
    };
    #swagger.parameters["body"] = {
      in: 'body',
      type: 'object',
      description: '資料格式',
      required: true,
      schema: {
        $comment: "留言",
      }
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "已留言",
        comment: {
          comment: "留言",
          user: "62d8b0456f6829d341ffa6b5",
          post: "62da10ba466951791dfb2d1a",
          _id: "62da1390c490be896b7fd8cc",
          createdAt: "2022-07-22T03:03:44.143Z",
        },
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  getAll: () => {
    /* 
    #swagger.tags = ['Posts']
    #swagger.description = '取得所有貼文'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.responses[200] = {
      schema: {
        status: "success",
        posts: [
          {
            _id: "62da10ba466951791dfb2d1a",
            user: {
              _id: "62d8b0456f6829d341ffa6b5",
              name: "小貓咪船長",
              photo: "https://i.imgur.com/PjN4yOu.png",
            },
            image: "",
            content: "測試",
            likes: [],
            createdAt: "2022-07-22T02:51:38.102Z",
            comments: [
              {
                _id: "62da1390c490be896b7fd8cc",
                comment: "456",
                user: {
                  _id: "62d8b0456f6829d341ffa6b5",
                  name: "小貓咪船長",
                  photo: "https://i.imgur.com/PjN4yOu.png",
                  createdAt: "2022-07-21T01:47:49.529Z",
                },
                post: "62da10ba466951791dfb2d1a",
              },
            ],
          },
        ],
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
};

module.exports = posts;
