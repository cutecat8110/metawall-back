const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Meta Wall API 範例文件",
    description: "一般用戶功能",
  },
  host: process.env.PORT || "localhost:3000",
  schemes: ["http", "https"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: "請加上 `Bearer ${API Token}`",
    },
  },
  tags: [
    {
      name: "Auth",
    },
    {
      name: "Users",
      description: "會員功能",
    },
    {
      name: "Likes",
      description: "按讚追蹤功能",
    },
    {
      name: "Posts",
      description: "動態貼文",
    },
    {
      name: "Upload",
      description: "上傳圖片",
    },
  ],

  definitions: {
    error400: {
      status: "error",
      message: "錯誤訊息",
    },
    generateJwt: {
      status: "success",
      user: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDkxYjE3Mzg5NzZhNGVlZDAwNzBkOSIsImlhdCI6MTY1ODM5NTQxNSwiZXhwIjoxNjU5MDAwMjE1fQ.xhHnBZf5c1KRu31Pfq2DFbxaHYKz2Pvu9sao9TZlcqc",
        name: "小貓咪船長",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
