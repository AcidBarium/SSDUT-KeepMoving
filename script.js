const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const dateInput = document.getElementById("DateInput");

const bgImage = new Image();
bgImage.src = "./bg.png"; // 你的背景图片

const touImage = new Image();
touImage.src = "./tou.jpg"; // 你的头

let userImg = null; // 存储用户上传的头像


// 生成一个 1 到 100 之间的随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成一个 1 到 100 之间的随机整数
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}


// 预加载背景图，防止黑屏
bgImage.onload = function () {
    drawCanvas();
};

// 监听文件上传
fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onload = function (e) {
        img.src = e.target.result;
    };

    img.onload = function () {
        userImg = img; // 存储上传的图片
        drawCanvas();  // 重新绘制
    };

    reader.readAsDataURL(file);
});

// **绘制背景**
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// **绘制头像**
function drawUserImage() {

    const centerX = 58; // 圆心 X 坐标
    const centerY = 163; // 圆心 Y 坐标
    const radius = 30; // 半径（头像大小的一半）

    ctx.save(); // 保存当前状态
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // 画圆
    ctx.closePath();
    ctx.clip(); // 裁剪成圆形区域

    // 绘制图片（确保头像能铺满圆形区域）
    if (userImg) {
        ctx.drawImage(userImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
    else {
        ctx.drawImage(touImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
    ctx.restore(); // 恢复状态，避免影响后续绘制
}

/**
 * 在 Canvas 上绘制带字间距的文字
 * @param {string} text - 要绘制的文字
 * @param {number} x - 文字的 x 坐标
 * @param {number} y - 文字的 y 坐标
 * @param {number} [fontSize=30] - 字体大小，默认 30
 * @param {string} [textColor="red"] - 文字颜色，默认红色
 * @param {boolean} [isBold=false] - 是否加粗，默认 false
 * @param {number} [letterSpacing=0] - 字符间距，默认 0
 * @param {boolean} [isNum=false] - 是否是数字模式
 */
function drawText(text, x, y, fontSize = 30, textColor = "red", isBold = false, letterSpacing = 0, isNum = false) {
    const fontWeight = isBold ? "bold" : "normal"; // 是否加粗
    if (isNum == false) {
        ctx.font = `${fontWeight} ${fontSize}px Arial`; // 设置字体
    }
    else {
        ctx.font = `${fontWeight} ${fontSize}px Qanelas`; // 设置字体
    }

    // ctx.font = `${fontWeight} ${fontSize}px 'Qanelas ExtraBold', Arial`; // 设定字体
    ctx.fillStyle = textColor;
    ctx.textAlign = "left"; // 左对齐

    let currentX = x; // 当前绘制的 X 坐标

    for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], currentX, y); // 绘制单个字符
        currentX += ctx.measureText(text[i]).width + letterSpacing; // 计算下一个字符的位置
    }
}

// **总绘制函数**
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    drawBackground(); // 绘制背景
    drawUserImage(); // 绘制头像

    // 读取用户输入的文字
    const textID = textInput.value.trim();
    if (textID) {
        drawText(textID, 100, 160, 20, "black", true, 2); // 在 (100, 400) 位置绘制蓝色文字
    }
    else {
        drawText("闪电旋风劈", 100, 160, 20, "black", true, 2);
    }

    const textDate = dateInput.value.trim();
    if (textDate) {
        drawText(textDate, 100, 190, 17, "grey", false, 2);
    }
    else {
        drawText("2024/02/29", 100, 190, 17, "grey", false, 2);
    }

    let GonliNum = getRandomFloat(3.2, 3.5);   // 输出公里数
    drawText(String(GonliNum), 25, 379, 95, "black", true, 2, true);

    // drawText("1234567", 100, 500, 90, "balck", true, 2, true); // 测试：绘制固定文字
}

// **生成图片**
function generateImage() {
    drawCanvas(); // 重新绘制
}

// **下载图片**
function downloadImage() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "generated-image.png";
    link.click();
}
