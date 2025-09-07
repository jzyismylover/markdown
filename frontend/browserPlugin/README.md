# 浏览器扩展开发

## 概述

Chrome 扩展程序（Extension）是一种可以自定义浏览器体验的小程序，能够为浏览器添加新功能或修改现有行为。本文档将介绍基于 Manifest V3 的 Chrome 扩展程序开发流程。

## Chrome 扩展程序的能力

Chrome 扩展程序可以实现以下功能：

### 页面交互
- **修改页面内容**：通过 Content Scripts 读取和修改网页内容
- **拦截网络请求**：监听、修改或阻止网络请求
- **添加右键菜单**：为页面添加自定义上下文菜单
- **页面注入**：向页面注入自定义的 CSS 和 JavaScript

### 浏览器功能增强
- **工具栏图标**：在浏览器工具栏显示扩展程序图标和徽章
- **弹窗界面**：点击图标显示弹窗（Popup）
- **新标签页**：自定义新标签页内容
- **书签管理**：读取和修改书签
- **历史记录**：访问浏览器历史记录

### 系统集成
- **本地存储**：使用 Chrome Storage API 存储数据
- **跨域请求**：在后台脚本中发起跨域请求
- **桌面通知**：显示系统通知
- **下载管理**：控制文件下载

## 扩展程序文件结构

```
my-extension/
├── manifest.json          # 配置清单文件
├── background.js          # 后台脚本（Service Worker）
├── content.js            # 内容脚本
├── popup.html            # 弹窗页面
├── popup.js              # 弹窗脚本
├── options.html          # 选项页面
├── options.js            # 选项页面脚本
├── icons/                # 图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── assets/               # 其他资源
    ├── styles.css
    └── images/
```

## Manifest V3 配置

### 基础配置

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "description": "Extension description",
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  
  "action": {
    "default_popup": "popup.html",
    "default_title": "Click me",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["styles.css"]
  }],
  
  "permissions": [
    "storage",
    "activeTab",
    "contextMenus"
  ],
  
  "host_permissions": [
    "https://*/*"
  ]
}
```

### 权限类型

#### 基础权限（permissions）
- `storage`: 使用 Chrome Storage API
- `activeTab`: 访问当前活动标签页
- `tabs`: 访问标签页 API
- `contextMenus`: 创建右键菜单
- `notifications`: 显示通知
- `downloads`: 管理下载
- `bookmarks`: 访问书签
- `history`: 访问历史记录

#### 主机权限（host_permissions）
- `https://*/*`: 访问所有 HTTPS 网站
- `http://localhost/*`: 访问本地服务器
- `https://api.example.com/*`: 访问特定 API

## 核心组件详解

### 1. Background Script（后台脚本）

在 Manifest V3 中，后台脚本运行在 Service Worker 环境中：

```javascript
// background.js
// 安装时触发
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // 创建右键菜单
  chrome.contextMenus.create({
    id: "my-menu",
    title: "My Custom Menu",
    contexts: ["selection"]
  });
});

// 监听右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "my-menu") {
    // 向 content script 发送消息
    chrome.tabs.sendMessage(tab.id, {
      action: "processSelection",
      text: info.selectionText
    });
  }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getData") {
    // 处理数据请求
    fetchData().then(data => {
      sendResponse({ success: true, data });
    });
    return true; // 异步响应
  }
});

async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
```

### 2. Content Scripts（内容脚本）

Content Scripts 运行在网页环境中，可以访问 DOM：

```javascript
// content.js
console.log('Content script loaded');

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processSelection") {
    processSelectedText(message.text);
    sendResponse({ success: true });
  }
});

function processSelectedText(text) {
  // 创建一个高亮元素
  const highlight = document.createElement('span');
  highlight.style.backgroundColor = 'yellow';
  highlight.style.padding = '2px';
  highlight.textContent = `Processed: ${text}`;
  
  // 插入到页面
  document.body.appendChild(highlight);
}

// 向 background 发送消息
function sendDataToBackground() {
  chrome.runtime.sendMessage({
    action: "getData"
  }, (response) => {
    if (response && response.success) {
      console.log('Received data:', response.data);
    }
  });
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // 初始化逻辑
  console.log('Page loaded, content script initialized');
}
```

### 3. Popup 界面

Popup 是点击扩展程序图标时显示的小窗口：

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 300px;
      padding: 10px;
    }
    .button {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border: none;
      background: #4285f4;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    .button:hover {
      background: #3367d6;
    }
  </style>
</head>
<body>
  <h3>My Extension</h3>
  <button id="actionBtn" class="button">Execute Action</button>
  <button id="optionsBtn" class="button">Open Options</button>
  <div id="status"></div>
  
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const status = document.getElementById('status');
  
  // 执行操作按钮
  actionBtn.addEventListener('click', async () => {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ 
        active: true, 
        currentWindow: true 
      });
      
      // 向 content script 发送消息
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "performAction"
      });
      
      status.textContent = 'Action completed!';
    } catch (error) {
      status.textContent = 'Error: ' + error.message;
    }
  });
  
  // 打开选项页面
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // 加载保存的设置
  loadSettings();
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['userPreferences']);
    if (result.userPreferences) {
      console.log('Loaded preferences:', result.userPreferences);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}
```

## 通讯机制

### 1. Runtime 消息传递

```typescript
// 发送消息（从任何脚本）
chrome.runtime.sendMessage({
  action: "getData",
  payload: { id: 123 }
}, (response) => {
  console.log('Response:', response);
});

// 监听消息（在 background 或 content script 中）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getData") {
    // 同步响应
    sendResponse({ data: "some data" });
    
    // 异步响应
    // handleAsyncRequest(message.payload).then(result => {
    //   sendResponse({ data: result });
    // });
    // return true; // 表示异步响应
  }
});
```

### 2. 标签页消息传递

```typescript
// 向特定标签页发送消息
chrome.tabs.sendMessage(tabId, {
  action: "updateUI",
  data: { theme: "dark" }
}, (response) => {
  console.log('Tab response:', response);
});

// 向所有标签页广播消息
chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      action: "broadcast",
      message: "Global update"
    });
  });
});
```

### 3. 长连接通讯

```javascript
// 建立长连接（从 content script 或 popup）
const port = chrome.runtime.connect({ name: "content-background" });

port.postMessage({ action: "init" });

port.onMessage.addListener((message) => {
  console.log('Received:', message);
});

// 在 background 中监听连接
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "content-background") {
    port.onMessage.addListener((message) => {
      console.log('Received from content:', message);
      
      // 响应消息
      port.postMessage({ 
        action: "response", 
        data: "Hello from background" 
      });
    });
  }
});
```

## 存储管理

### Chrome Storage API

```typescript
// 保存数据
chrome.storage.sync.set({
  userSettings: {
    theme: 'dark',
    autoSave: true
  }
}, () => {
  console.log('Settings saved');
});

// 读取数据
chrome.storage.sync.get(['userSettings'], (result) => {
  const settings = result.userSettings || {};
  console.log('Current settings:', settings);
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const key in changes) {
    const storageChange = changes[key];
    console.log(`Storage key "${key}" changed:`, {
      oldValue: storageChange.oldValue,
      newValue: storageChange.newValue
    });
  }
});

// 批量操作
async function manageStorage() {
  // 设置多个值
  await chrome.storage.local.set({
    cache: { timestamp: Date.now() },
    preferences: { lang: 'zh-CN' }
  });
  
  // 获取所有值
  const allData = await chrome.storage.local.get();
  console.log('All stored data:', allData);
  
  // 清除特定值
  await chrome.storage.local.remove(['cache']);
  
  // 清除所有值
  await chrome.storage.local.clear();
}
```

### 存储类型对比

| 类型 | 容量限制 | 同步 | 用途 |
|------|----------|------|------|
| `chrome.storage.sync` | 100KB | 是 | 用户设置、偏好 |
| `chrome.storage.local` | 5MB | 否 | 缓存、临时数据 |
| `chrome.storage.session` | 1MB | 否 | 会话数据 |

## 常用 API 示例

### 1. 标签页操作

```typescript
// 获取当前活动标签页
const [activeTab] = await chrome.tabs.query({
  active: true,
  currentWindow: true
});

// 创建新标签页
const newTab = await chrome.tabs.create({
  url: 'https://example.com',
  active: true
});

// 更新标签页
await chrome.tabs.update(tabId, {
  url: 'https://new-url.com'
});

// 关闭标签页
await chrome.tabs.remove(tabId);

// 监听标签页变化
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});
```

### 2. 网络请求拦截

```typescript
// 在 manifest.json 中添加权限
// "permissions": ["webRequest", "webRequestBlocking"]
// "host_permissions": ["<all_urls>"]

// 拦截请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log('Request:', details.url);
    
    // 阻止请求
    if (details.url.includes('blocked-domain.com')) {
      return { cancel: true };
    }
    
    // 重定向请求
    if (details.url.includes('redirect-me.com')) {
      return { 
        redirectUrl: 'https://new-destination.com' 
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 修改请求头
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders;
    headers.push({
      name: 'Custom-Header',
      value: 'Extension-Value'
    });
    
    return { requestHeaders: headers };
  },
  { urls: ["https://api.example.com/*"] },
  ["blocking", "requestHeaders"]
);
```

### 3. 右键菜单

```typescript
// 创建菜单项
chrome.contextMenus.create({
  id: "main-menu",
  title: "My Extension",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "sub-menu-1",
  parentId: "main-menu",
  title: "Sub Menu 1",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "sub-menu-2",
  parentId: "main-menu",
  title: "Sub Menu 2",
  contexts: ["link"]
});

// 处理菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "sub-menu-1":
      handleTextSelection(info.selectionText, tab);
      break;
    case "sub-menu-2":
      handleLinkClick(info.linkUrl, tab);
      break;
  }
});

function handleTextSelection(text: string, tab: chrome.tabs.Tab) {
  chrome.tabs.sendMessage(tab.id!, {
    action: "processText",
    text: text
  });
}
```

## 开发调试

### 1. 加载开发版扩展程序

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择扩展程序根目录

### 2. 调试技巧

```typescript
// 在 background script 中调试
console.log('Background script loaded');

// 在 content script 中调试
console.log('Content script on:', window.location.href);

// 使用 debugger 断点
debugger;

// 查看存储内容
chrome.storage.local.get(null, (items) => {
  console.log('All storage:', items);
});
```

### 3. 错误处理

```typescript
// 全局错误处理
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started');
});

// API 调用错误处理
async function safeApiCall() {
  try {
    const tabs = await chrome.tabs.query({active: true});
    return tabs[0];
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}

// 检查 runtime 错误
if (chrome.runtime.lastError) {
  console.error('Runtime error:', chrome.runtime.lastError);
}
```

## 打包与发布

### 1. 准备发布

```bash
# 创建发布版本
mkdir release
cp -r src/* release/
cd release

# 移除开发文件
rm -rf node_modules
rm package.json
rm *.ts
```

### 2. 打包扩展程序

1. 在 `chrome://extensions/` 页面
2. 点击"打包扩展程序"
3. 选择扩展程序根目录
4. 生成 `.crx` 文件和私钥

### 3. 发布到 Chrome Web Store

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. 创建开发者账户（需要支付 $5 注册费）
3. 上传 ZIP 包
4. 填写扩展程序信息：
   - 名称和描述
   - 图标和截图
   - 分类和标签
   - 隐私政策

### 4. 版本更新

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.1.0",  // 更新版本号
  "version_name": "1.1.0 Beta"  // 可选的版本名称
}
```

## 最佳实践

### 1. 性能优化

```typescript
// 延迟加载内容脚本
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('target-site.com')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

// 使用 Offscreen API 处理重任务
chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: ['BLOBS'],
  justification: 'Process large data files'
});
```

### 2. 安全性

```typescript
// 内容安全策略
// 在 manifest.json 中
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}

// 避免 eval 和内联脚本
// ❌ 不推荐
// eval('dangerous code');

// ✅ 推荐
const safeFunction = new Function('return safe code');
```

### 3. 用户体验

```typescript
// 渐进式权限请求
document.getElementById('enable-feature').addEventListener('click', async () => {
  const granted = await chrome.permissions.request({
    permissions: ['tabs']
  });
  
  if (granted) {
    enableFeature();
  } else {
    showPermissionDeniedMessage();
  }
});

// 国际化支持
const message = chrome.i18n.getMessage('hello_world');
document.getElementById('greeting').textContent = message;
```

## 常见问题

### 1. Manifest V2 迁移到 V3

| V2 | V3 | 说明 |
|----|----|------|
| `background.scripts` | `background.service_worker` | 后台脚本改为 Service Worker |
| `browser_action` | `action` | 工具栏按钮配置 |
| `content_security_policy` | `content_security_policy.extension_pages` | CSP 配置结构变化 |
| `web_accessible_resources` | 数组格式 | 需要指定匹配规则 |

### 2. 权限问题

```typescript
// 检查权限
const hasPermission = await chrome.permissions.contains({
  permissions: ['tabs']
});

// 动态请求权限
const granted = await chrome.permissions.request({
  permissions: ['bookmarks'],
  origins: ['https://developer.chrome.com/*']
});
```

### 3. 跨域请求

```javascript
// 在 manifest.json 中声明主机权限
{
  "host_permissions": [
    "https://api.example.com/*"
  ]
}

// 在 background script 中发起请求
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 总结

Chrome 扩展程序开发基于 Web 技术栈，具有强大的浏览器集成能力。关键要点：

1. **理解架构**：掌握 background、content scripts、popup 等组件的作用和通讯方式
2. **权限管理**：合理声明和使用权限，优化用户体验
3. **Manifest V3**：适应新版本的架构变化，使用 Service Worker
4. **调试技巧**：熟练使用开发者工具进行调试
5. **安全性**：遵循安全最佳实践，保护用户数据

通过本指南，您应该能够开发出功能丰富、性能优秀的 Chrome 扩展程序。

