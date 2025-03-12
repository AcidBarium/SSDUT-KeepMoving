const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const dateInput = document.getElementById("DateInput");
const timerightnowimput = document.getElementById("RightNowTimeInput");
const dianlianInput = document.getElementById("DianLianInput");

const bgImage = new Image();
bgImage.src = "./bg.png"; // 你的背景图片

const FBDSQImage = new Image();
FBDSQImage.src = "./faBuDaoSheQu.png"

const touImage = new Image();
touImage.src = "./tou2.png"; // 你的默认头

const dianchiImage = new Image();
dianchiImage.src = "icBatter.png";  //电池图标

let userImg = null; // 存储用户上传的头像


// 图片数组（存放服务器图片 URL）
const imagesPaodao = [
    "./source/1.png",
    "./source/2.png",
    "./source/3.png",
    "./source/4.png",
    "./source/5.png",
    "./source/6.png",
    "./source/7.png"
];

let loadedImagesPaoDao = new Array(imagesPaodao.length); // 预留空间，确保索引匹配

// **预加载所有图片**
imagesPaodao.forEach((src, index) => {
    let img = new Image();
    img.src = src;
    img.onload = function () {
        loadedImagesPaoDao[index] = img; // 确保存入正确索引
        // console.log(`图片 ${index} 加载完成`);
    };
});

// **绘制指定索引的图片**
function drawImagePaoDaoByIndex(index, x, y, width, height) {
    if (loadedImagesPaoDao[index]) {
        ctx.drawImage(loadedImagesPaoDao[index], x, y, width, height);
    } else {
        console.log(`图片 ${index} 还未加载`);
    }
}



// 生成一个随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成一个随机浮点数整数
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}


/**
 * 将一个日期字符串的后面的日期转换为小数
 * @param {*string} dateString 
 * @returns 
 */
function convertDateToNumber(dateString) {
    let parts = dateString.split("/"); // 用 `let` 声明可变变量
    if (parts.length !== 3) return null;

    let month = parseInt(parts[1], 10); // 提取月份
    let day = parseInt(parts[2], 10);   // 提取日期

    let decimalPart = (day / 31).toFixed(1); // 计算小数部分
    let result = parseFloat(`${month}${decimalPart.substring(1)}`); // 拼接数字

    return result; // 返回可变变量
}


// 预加载背景图，防止黑屏
bgImage.onload = function () {
    drawCanvas();
};

FBDSQImage.onload = function () {
    drawCanvas(); // 确保图片加载后再绘制
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


/**
 * 将小数转换为 60 进制时间格式（分'秒''）
 * @param {number} num - 需要转换的数字
 * @returns {string} - 返回格式化后的字符串，例如 6.9 -> "06'59''"
 */
function convertToSexagesimal(num) {
    if (num < 0) return "00'00''"; // 处理负数情况

    let minutes = Math.floor(num); // 取整数部分作为分钟
    let seconds = Math.round((num - minutes) * 60); // 取小数部分转换为秒，并四舍五入

    if (seconds === 60) { // 处理进位（例如 6.9999 -> 07'00''）
        minutes += 1;
        seconds = 0;
    }

    // 格式化为两位数
    let minStr = minutes.toString().padStart(2, "0");
    let secStr = seconds.toString().padStart(2, "0");

    return `${minStr}'${secStr}''`;
}

// 绘制圆角矩形
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
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
        drawText("究极暴龙战士", 100, 160, 20, "black", true, 2);
    }

    let textDate = dateInput.value.trim();
    if (textDate) {
        drawText(textDate, 100, 185, 17, "grey", false, 2);
    }
    else {
        drawText("2024/02/29", 100, 185, 17, "grey", false, 2);
    }

    let timeNow = timerightnowimput.value.trim();
    if (timeNow) {
        drawText(timeNow, 70, 50, 22, "black", true, 1);
    } else {
        drawText("12:30", 70, 50, 22, "black", true, 1);
    }

    let dianlian = parseFloat(dianlianInput.value.trim()) / 100.0 * 24.0;
    if (dianlian) {
        ctx.fillStyle = "black"; // 设置填充颜色
        drawRoundedRect(505, 34, dianlian, 10, 2); // 绘制矩形  满电24
    }
    else {
        ctx.fillStyle = "black"; // 设置填充颜色
        drawRoundedRect(505, 34, 18, 10, 2); // 绘制矩形  满电24
    }




    let GonliNum = getRandomFloat(3.2, 3.5);   // 输出公里数
    drawText(String(GonliNum), 25, 379, 95, "black", true, 1, true);

    let TimeConsue = getRandomInt(25, 35);  //花费的时间

    let peishu = TimeConsue / GonliNum;
    let textPeishu = convertToSexagesimal(peishu)

    let TimeConsueSecond = getRandomInt(1, 53);

    let runTimeHourBegin = getRandomInt(9, 20);
    let runTimeMinuteBegin = getRandomInt(1, 60);

    let runTimeEnd = runTimeHourBegin * 60 + runTimeMinuteBegin + TimeConsue;

    let runTimeHourEnd = Math.floor(runTimeEnd / 60);
    let runTimeMinuteEnd = runTimeEnd - runTimeHourEnd * 60;

    drawText("00:" + String(TimeConsue) + ":" + TimeConsueSecond.toString().padStart(2, "0"), 30, 1016, 30, "black", true, 1, true)
    drawText(textPeishu, 240, 1016, 30, "black", true, 1, true);   //输出配速
    drawText(String(TimeConsue * 10 + getRandomInt(1, 30) - 10), 440, 1016, 30, "black", true, 1, true);
    drawText("00:" + String(TimeConsue) + ":" + (TimeConsueSecond + getRandomInt(1, 6)).toString().padStart(2, "0"), 30, 1106, 30, "black", true, 1, true) //总时间
    drawText(String(getRandomInt(23, 27)), 240, 1106, 30, "black", true, 1, true) //运动负荷
    drawText(String(Math.floor(peishu * 12)), 440, 1106, 30, "black", true, 1, true)  //步频
    drawText(String(getRandomFloat(0.72, 0.85)), 30, 1191, 30, "#9B8F8F", true, 1, true);  //步幅

    //输出跑步时的时间
    drawText(String(runTimeHourBegin).padStart(2, "0") + ":" + String(runTimeMinuteBegin).padStart(2, "0") + " - " + String(runTimeHourEnd).padStart(2, "0") + ":" + String(runTimeMinuteEnd).padStart(2, "0"), 210, 185, 17, "grey", false, 0);  //步幅

    let isWeather = getRandomInt(1, 20);
    let weather = "晴";
    if (isWeather <= 10)
        weather = "晴";
    else if (isWeather == 16)
        weather = "阴";
    else if (isWeather == 17) {
        weather = "多云";
    } else if (isWeather == 18) {
        weather = "轻度雾霾";
    } else {
        weather = "阴";
    }

    if (!textDate) {
        textDate = "2024/02/29"
    }
    let numDate = convertDateToNumber(textDate);
    let temputure = 20 * Math.sin(3.14 / 6.0 * (numDate - 4.0)) + 7.5 + parseFloat(getRandomFloat(0, 2.5));
    // let temputure = 20 * Math.sin(3.14 / 6.0 * (numDate - 4.0)) + 7.5 ;
    temputure = temputure.toFixed(0);

    drawText("大连市 • " + weather + " • " + String(temputure) + "°C", 320, 185, 17, "grey", false, 0);   //输出跑步天气和地点


    let numPaoDaoSuiJi = getRandomInt(0, imagesPaodao.length - 1)
    drawImagePaoDaoByIndex(numPaoDaoSuiJi, 0, 412, 585, 438);   //绘制跑道

    ctx.drawImage(FBDSQImage, 67, 1128, 453, 83);
    ctx.drawImage(dianchiImage, 501, 22, 35, 35);


    // ctx.drawImage(FBDSQImage, 0, 0, 453, 83);

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
