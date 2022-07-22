const users = {
  sign_up: () => {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = '註冊'
    #swagger.parameters["body"] = {
      in: 'body',
      type: 'object',
      description: '資料格式',
      required: true,
      schema: {
        $name: "小貓咪船長",
        $email: "test1@example.com",
        $password: "Test123456",
      }
    };
    #swagger.responses[201] = {
      description: "產生 token",
      schema: { $ref: '#/definitions/generateJwt' },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  sign_in: () => {
    /* 
    #swagger.tags = ["Users"];
    #swagger.description = "登入";
    #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      description: "資料格式",
      required: true,
      schema: {
        $email: "test1@example.com",
        $password: "Test123456",
      },
    };
    #swagger.responses[201] = {
      description: "產生 token",
      schema: { $ref: '#/definitions/generateJwt' },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    }; 
    */
  },
  checkLogin: () => {
    /* 
    #swagger.tags = ["Auth"];
    #swagger.description = "確認登入";
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.responses[201] = {
      description: "產生 token",
      schema: {
        status: "success",
        message: "已登入",
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    }; 
    */
  },
  updatePassword: () => {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = '重設密碼'
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
        $password: "Test123456",
        $confirmPassword: "Test123456",
      }
    };
    #swagger.responses[201] = {
      description: "產生 token",
      schema: { $ref: '#/definitions/generateJwt' },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  getProfile: () => {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = '取得個人資料'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.responses[200] = {
      schema: {
        status: "success",
        user: {
          _id: "62d8b0456f6829d341ffa6b5",
          name: "小貓咪船長",
          photo: "https://i.imgur.com/PjN4yOu.png",
          sex: "male",
          followers: [],
          following: [
            {
              user: {
                _id: "62d8b1076f6829d341ffa6bb",
                name: "兔兒在線發牌",
                photo: "https://i.imgur.com/qTCnmeB.png",
              },
              createdAt: "2022-07-21T03:19:47.626Z",
            },
            {
              user: {
                _id: "62d8b1116f6829d341ffa6be",
                name: "少年情壞餵了狗",
                photo: "https://i.imgur.com/SukCtZE.png",
              },
              createdAt: "2022-07-21T10:04:29.240Z",
            },
          ],
        },
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  updateProfile: () => {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = '編輯個人資料'
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
        photo: "https://i.imgur.com/PjN4yOu.png",
        name: "小貓咪船長",
        sex: "male",
      }
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "用戶資訊已更新",
        user: {
          _id: "62d8b0456f6829d341ffa6b5",
          name: "小貓咪船長",
          photo: "https://i.imgur.com/PjN4yOu.png",
          sex: "male",
          followers: [],
          following: [
            {
              user: "62d8b1076f6829d341ffa6bb",
              createdAt: "2022-07-21T03:19:47.626Z",
            },
            {
              user: "62d8b1116f6829d341ffa6be",
              createdAt: "2022-07-21T10:04:29.240Z",
            },
          ],
        },
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  getLikeList: () => {
    /* 
    #swagger.tags = ['Likes']
    #swagger.description = '取得 / 按讚貼文列表'
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
            _id: "62d8be326f6829d341ffa789",
            user: {
              _id: "62d8b0f26f6829d341ffa6b8",
              name: "漫步熊布朗",
              photo: "https://i.imgur.com/AZud19U.png",
            },
            image: "https://i.imgur.com/ILpkBcO.jpg",
            content:
              "昨天去動物園\n工作人員說：20 元可以買一隻活雞餵老虎\n於是我買了隻回家吃，真香XD",
            likes: [
              "62d8b1076f6829d341ffa6bb",
              "62d8b0456f6829d341ffa6b5",
              "62d8b1116f6829d341ffa6be",
            ],
            createdAt: "2022-07-21T02:47:14.604Z",
          },
        ],
      },
    };
    */
  },
  follow: () => {
    /* 
    #swagger.tags = ["Likes"];
    #swagger.description = "追蹤用戶";
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "User ID",
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "已成功追蹤",
      },
    };
     */
  },
  unFollow: () => {
    /* 
    #swagger.tags = ["Likes"];
    #swagger.description = "取消追蹤用戶";
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["id"] = {
      description: "User ID",
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "已取消追蹤",
      },
    };
     */
  },
};

module.exports = users;
