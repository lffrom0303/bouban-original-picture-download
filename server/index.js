const express = require("express");
const cors = require("cors");
const fetchImages = require("./utils/photo");
const app = express();
const port = 3000;

app.use(cors());
// 使用 express.json() 中间件来解析 JSON 格式的请求体
app.use(express.json());

app.post("/movie/saveImageList", (req, res) => {
  // 访问请求体中的参数
  const { imageIdsList } = req.body;
  // 获取图片数据
  fetchImages(imageIdsList);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
