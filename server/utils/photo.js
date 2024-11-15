const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

// 桌面路径
const desktopPath = path.join(
  require("os").homedir(),
  "Desktop",
  "douban_images"
);

// 检查并创建桌面文件夹
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath);
}

// 下载图片函数
const downloadImage = async (url, imagePath) => {
  try {
    // 检查文件是否已存在
    if (fs.existsSync(imagePath)) {
      // console.log(`文件 ${path.basename(imagePath)} 已存在，覆盖文件...`);
      return;
    }
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        Referer: "https://www.douban.com/",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (e) {
    throw e;
  }
};

// 主逻辑
const fetchImages = async (imageIdsList) => {
  if (imageIdsList.length) {
    for (const { imageId, imgPrefix, originUrl } of imageIdsList) {
      let imageDownloaded = false;
      const url = `https://${imgPrefix}.doubanio.com/view/photo/raw/public/${imageId}.jpg`;
      const imagePath = path.join(desktopPath, `${imageId}.jpg`);
      try {
        await downloadImage(url, imagePath);
        console.log(`图片原图下载成功`);
        imageDownloaded = true;
      } catch (e) {}

      if (!imageDownloaded) {
        console.log(`图片原图下载失败，开始下载缩略图！`);
        await downloadImage(originUrl, imagePath);
        console.log(`图片缩略图下载成功`);
      }
    }
    console.log("图片下载任务完成！");
  }
};
module.exports = fetchImages;
