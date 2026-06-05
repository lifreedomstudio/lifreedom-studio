const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ⛔ 0. 防呆機制：檢查系統是否已安裝 ffmpeg
try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (e) {
    console.error('\n❌ 錯誤：請先安裝 ffmpeg 才能使用此自動化工具！');
    console.error('👉 Mac 用戶可執行指令：brew install ffmpeg');
    console.error('👉 Windows 用戶請至官網下載並將其加入環境變數 (Path) 中。\n');
    process.exit(1);
}

// 🔥 1. 支援參數化：從終端機讀取路徑，預設為 public/audio/step0
const targetPath = process.argv[2] || 'public/audio/step0';
const inputDir = path.resolve(__dirname, targetPath);

// 自動在目標資料夾內建立 normalized 資料夾，維持目錄結構乾淨
const outputDir = path.join(inputDir, 'normalized');

// 檢查目標資料夾是否存在
if (!fs.existsSync(inputDir)) {
    console.error(`\n❌ 找不到指定的資料夾：${inputDir}\n`);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// ⛔ 核心防護：絕對不能動音量的檔案
const skipFiles = [
    'q5normal.mp3',
    'q5louder.mp3',
    'q6unstable.mp3',
    'q6stable.mp3'
];

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.mp3'));

// 🔥 2. 加入處理統計 UX
let processed = 0;
let skipped = 0;

console.log(`\n📂 開始掃描目錄: ${targetPath}`);
console.log(`--------------------------------------------------`);

files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    if (skipFiles.includes(file)) {
        console.log(`⏭️  保留原音量，直接複製：${file}`);
        fs.copyFileSync(inputPath, outputPath);
        skipped++;
    } else {
        console.log(`🎧 正在標準化處理 (LUFS -14) [linear=true]：${file}`);

        // 🔥 3. 加入 linear=true，讓 Single-pass 更精準穩定
        try {
            const cmd = `ffmpeg -i "${inputPath}" -af loudnorm=I=-14:TP=-1.5:LRA=11:linear=true -c:a libmp3lame -b:a 320k "${outputPath}" -y`;
            execSync(cmd, { stdio: 'ignore' });
            processed++;
        } catch (err) {
            console.error(`❌ 處理 ${file} 時發生錯誤:`, err.message);
        }
    }
});

console.log(`--------------------------------------------------`);
console.log(`✅ 完成！處理 ${processed} 個，略過 ${skipped} 個`);
console.log(`📁 輸出位置: ${outputDir}\n`);