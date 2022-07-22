const upload = {
  avatar: () => {
    /* 
    #swagger.tags = ['Upload']
    #swagger.description = '上傳頭像'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["formData"] = {
      in: 'formData',
      description: '.jpg / .png / .jpeg',
      required: true,
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "圖片已上傳",
        imgUrl: "https://i.imgur.com/A3NZRSo.jpg",
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
  post: () => {
    /* 
    #swagger.tags = ['Upload']
    #swagger.description = '上傳貼文圖片'
    #swagger.security = [
      {
        apiKeyAuth: [],
      },
    ];
    #swagger.parameters["formData"] = {
      in: 'formData',
      description: '.jpg / .png / .jpeg',
      required: true,
    };
    #swagger.responses[200] = {
      schema: {
        status: "success",
        message: "圖片已上傳",
        imgUrl: "https://i.imgur.com/A3NZRSo.jpg",
      },
    };
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/error400' },
    };
    */
  },
};

module.exports = upload;
