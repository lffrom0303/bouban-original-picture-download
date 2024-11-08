// 创建按钮容器
const container = document.createElement("div");
container.style.position = "fixed";
container.style.top = "10px";
container.style.right = "10px";
container.style.zIndex = "1000";
container.style.backgroundColor = "white";
container.style.border = "1px solid #ccc";
container.style.padding = "10px";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "10px";

// 创建下载按钮
const downloadButton = document.createElement("button");
downloadButton.textContent = "下载选中图片";
container.appendChild(downloadButton);

// 创建全选按钮
const selectAllButton = document.createElement("button");
selectAllButton.textContent = "全选/取消全选";
container.appendChild(selectAllButton);

document.body.appendChild(container);

const handleImages = () => {
  return Array.from(document.querySelectorAll("img")).filter((img) =>
    img.src.includes("/view/photo/")
  );
};
// 获取所有图片并显示复选框
let images = handleImages();
const checkboxes = [];

// 函数来为新获取的图片添加复选框
function addCheckboxToImages(images) {
  images.forEach((img, index) => {
    if (!img.dataset.hasCheckbox) {
      // 创建复选框并插入到图片的父元素中
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.position = "absolute";
      checkbox.style.margin = "5px"; // 调整边距以更好地显示
      checkbox.style.left = "0px";
      checkbox.style.top = "0px";
      // 设置图片父元素的样式以便定位
      img.style.position = "relative";
      img.parentElement.style.position = "relative";
      img.parentElement.style.display = "inline-block";
      // 将复选框插入图片的父元素，使其显示在图片上
      img.parentElement.appendChild(checkbox);
      img.dataset.hasCheckbox = "true"; // 标记已处理
      // 记录复选框引用
      checkboxes.push(checkbox);
    }
  });
}

// 初次加载时为页面上已有的图片添加复选框
addCheckboxToImages(images);

// 使用 MutationObserver 监听新图片的加载
const observer = new MutationObserver((mutationsList) => {
  let newImagesDetected = false;
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === "IMG" && node.src.includes("/view/photo/")) {
          newImagesDetected = true;
        } else if (node.querySelectorAll) {
          const newImages = node.querySelectorAll("img");
          if (newImages.length > 0) {
            newImagesDetected = true;
          }
        }
      });
    }
  });

  // 如果检测到新图片，更新 images 并添加复选框
  if (newImagesDetected) {
    images = handleImages();
    addCheckboxToImages(images);
  }
});

// 配置观察器来监听整个文档
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// 下载选中图片的逻辑
downloadButton.addEventListener("click", async () => {
  const imageIdsList = [];
  checkboxes.forEach((checkbox, i) => {
    if (checkbox.checked) {
      const imgSrc = images[i].src;
      const imageId = imgSrc.split("/").pop().split(".")[0];
      const imgPrefix = imgSrc.split(".")[0].split("//")[1];
      console.log(imgSrc, imgPrefix, imageId);
      imageIdsList.push({
        imgPrefix,
        imageId,
      });
    }
  });
  const serverUrl = "http://localhost:3000";
  if (imageIdsList.length) {
    await fetch(`${serverUrl}/movie/saveImageList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageIdsList: imageIdsList,
      }),
    });
  }
});

// 全选/取消全选的逻辑
selectAllButton.addEventListener("click", () => {
  const allSelected = checkboxes.every((checkbox) => checkbox.checked);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allSelected; // 全选或取消全选
  });
});
