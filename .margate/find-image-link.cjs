const fs = require("fs");
const path = require("path");
const readline = require("readline");

const IMAGE_REGEX = /!\[.*?\]\(([^\)]+)\)|<img\s+[^>]*src=["']([^"']+)["']/gi;

const ERROR_IMAGE_REGEX = /^(?!(https?|\.))/;

const BASIC_DIR = path.join(__dirname, "..");

function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  const markdownFiles = [];
  files.forEach((file) => {
    if (![".vuepress", ".git", ".margate", "node_modules"].includes(file)) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        markdownFiles.push(...getMarkdownFiles(filePath));
      } else if (file.endsWith(".md")) {
        markdownFiles.push(filePath);
      }
    }
  });
  return markdownFiles;
}

async function processMarkdownFiles(markdownFiles) {
  return new Promise((resolve) => {
    const results = [];

    markdownFiles.forEach(async (file, index) => {
      const fileStream = fs.createReadStream(file, "utf-8");

      // 使用 readline 逐行读取文件，避免一次性读取文件内容过大
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let lineNumber = 0;
      const contextLines = [];

      for await (const line of rl) {
        lineNumber++;
        contextLines.push(line);
        // 保持最近5行 作为上下文
        if (contextLines.length > 5) {
          contextLines.shift();
        }

        let match;
        while ((match = IMAGE_REGEX.exec(line)) !== null) {
          const imagePath = match[1] || match[2];
          // 将非相对路径 & 非网络图片的引用筛选出来
          if (ERROR_IMAGE_REGEX.test(imagePath)) {
            results.push({ file, image: imagePath, line: lineNumber });
          }
        }

        // 重置正则选择器索引
        IMAGE_REGEX.lastIndex = 0;
      }

      if (index === markdownFiles.length - 1) {
        resolve(results);
      }
    });
  });
}

function formatResults(results) {
  if (results.length === 0) {
    console.log("未找到匹配的图片引用");
    return;
  }

  console.log(`\n共找到 ${results.length} 个匹配结果：`);
  results.forEach((result, index) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`结果 #${index + 1}`);
    console.log(`Markdown文件: ${result.file}`);
    console.log(`图片路径: ${result.image}`);
    console.log(`行号: ${result.line}`);
  });
}

(async () => {
  const markdownFiles = getMarkdownFiles(BASIC_DIR);
  const results = await processMarkdownFiles(markdownFiles);
  formatResults(results);
})();
