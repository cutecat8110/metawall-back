const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
).replace("Database", "metawall");

mongoose.connect(DB).then(() => console.log("資料庫 連接成功"));
