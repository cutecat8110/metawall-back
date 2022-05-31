const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Meta API",
    description: "示範範例生成文件",
  },
  host: process.env.PORT || "localhost:3000",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
