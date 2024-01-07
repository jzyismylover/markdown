# 学习内容

## 快应用卡片开发

:::tip 学习资料
1. [快应用开发文档](https://doc.quickapp.cn/tutorial/framework/theme-mode.html#forcedark-%E5%BC%80%E5%85%B3)
2. [快应用卡片开发文档](https://open.oppomobile.com/new/developmentDoc/info?id=11803)
:::

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>卡片</title>
  <style>
    .card-box {
      display: flex;
      width: 400px;
      height: 400px;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      background-color: #8f8c8c;
    }
    .card-box div {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      background-color: rgb(68, 70, 70);
    }

    @media (prefer-color-scheme: dark) {
      .card-box {
        background-color: #010101;
      }
      .card-box div {
        background-color: #ffffff;
      }
    }
  </style>
</head>
<body>
  <div class="card-box">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</body>
</html>
```