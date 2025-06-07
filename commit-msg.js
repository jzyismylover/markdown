const { execSync } = require("child_process");
const path = require("path");

/**
 * 获取项目中所有目录列表作为 scope 选项
 * @returns {string[]} 目录列表
 */
function getProjectDirectories() {
  try {
    // 获取当前项目的所有目录（排除 node_modules, .git 等）
    const excludePatterns = [
      "node_modules",
      ".git",
      ".vscode",
      ".idea",
      "dist",
      "build",
      "coverage",
      ".next",
      ".nuxt",
    ];

    // sed 's|pattern|replacement|flags'
    const findCommand = `find . -type d -not -path '*/.*' | grep -v -E '(${excludePatterns.join(
      "|"
    )})' | sed 's|^./||' | head -50`;
    const output = execSync(findCommand, { encoding: "utf8" });

    const directories = output
      .trim()
      .split("\n")
      .filter((dir) => dir && dir !== ".")
      .filter((dir, index, arr) => arr.indexOf(dir) === index) // 去重
      .sort();

    return directories;
  } catch (error) {
    console.warn("获取项目目录失败:", error.message);
    return ["src", "lib", "components", "utils", "docs", "test"]; // 默认常见目录
  }
}

/**
 * 获取当前 git 暂存区修改文件的父级目录
 * @returns {string} 用 / 分割的目录列表
 */
function getModifiedFileScopes() {
  try {
    // 获取暂存区的文件
    const stagedFiles = execSync("git diff --cached --name-only", {
      encoding: "utf8",
    });

    if (!stagedFiles.trim()) {
      // 如果暂存区没有文件，获取工作区修改的文件
      const modifiedFiles = execSync("git diff --name-only", {
        encoding: "utf8",
      });
      if (!modifiedFiles.trim()) {
        return "";
      }
      return extractScopes(modifiedFiles);
    }

    return extractScopes(stagedFiles);
  } catch (error) {
    console.warn("获取 git 修改文件失败:", error.message);
    return "";
  }
}

/**
 * 从文件列表中提取父级目录
 * @param {string} fileList - 文件列表字符串
 * @returns {string} 用 / 分割的目录列表
 */
function extractScopes(fileList) {
  const files = fileList
    .trim()
    .split("\n")
    .filter((file) => file.trim());
  const scopes = new Set();

  files.forEach((file) => {
    const dir = path.dirname(file);
    if (dir && dir !== ".") {
      // 只取第一级目录
      const firstLevelDir = dir.split("/")[0];
      scopes.add(firstLevelDir);
    }
  });

  return Array.from(scopes).join("/");
}

function prompter(cz, commit) {
  const autoScope = getModifiedFileScopes();
  const projectDirectories = getProjectDirectories();

  // 构建 scope 选择列表
  const scopeChoices = [
    ...(autoScope && autoScope !== ""
      ? [{ name: `🎯 自动检测: ${autoScope}`, value: autoScope }]
      : []),
    ...projectDirectories.map((dir) => ({ name: `📁 ${dir}`, value: dir })),
    { name: "📝 手动输入", value: "custom" },
  ];

  cz.prompt([
    {
      type: "list",
      name: "type",
      message: "选择提交类型:",
      choices: [
        { name: "feat: 新功能", value: "feat" },
        { name: "fix: 修复bug", value: "fix" },
        { name: "docs: 文档更新", value: "docs" },
        { name: "style: 代码格式", value: "style" },
        { name: "refactor: 重构", value: "refactor" },
        { name: "test: 测试", value: "test" },
        { name: "chore: 构建/工具", value: "chore" },
      ],
    },
    {
      type: "list",
      name: "scopeChoice",
      message: "选择作用范围:",
      choices: scopeChoices,
      pageSize: 15,
    },
    {
      type: "input",
      name: "customScope",
      message: "请输入自定义作用范围:",
      when: function (answers) {
        return answers.scopeChoice === "custom";
      },
      validate: function (input) {
        if (!input || input.trim() === "") {
          return "作用范围不能为空";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "subject",
      message: "请输入提交概要:",
      validate: function (input) {
        if (!input || input.trim() === "") {
          return "提交概要不能为空";
        }
        return true;
      },
    },
  ])
    .then((answers) => {
      const { type, scopeChoice, customScope, subject } = answers;
      const scope = scopeChoice === "custom" ? customScope : scopeChoice;

      const message = `${type}(${scope}): ${subject}`;
      console.log("生成的提交信息:", message);
      commit(message);
    })
    .catch((error) => {
      console.error("提交失败:", error);
    });
}

module.exports = {
  prompter,
};
