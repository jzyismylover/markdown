# 百度网盘文件网页直链下载

## 背景
最近因为不想下载百度网盘客户端想直接在网页上下载文件，所以在网上先搜索了一些方法，大部分都是通过油猴加载三方脚本在百度网盘里边注入一个“按钮”，点击按钮后将同步到 aria2 或者其他工具里边从而触发文件下载。但是实际在用的时候试了几个插件都行 —— 网页上并没有按预期出现对应的“下载” 入口，折腾了几个插件发现一直都没有对应的按钮入口，我猜测可能是百度的 dom 节点结构或者对应命名有发生变更，为了窥探里边实现原理，遂把整段 js 脚本都下载看里边的实现。

## 目标
最后期望的是能够拿到直链然后免安装客户端下载


## 实现

首先需要了解几个关键接口：

- 获取 access_token: https://openapi.baidu.com/oauth/2.0/authorize?response_type=token&scope=basic,netdisk&client_id=IlLqBbU3GjQ0t46TRwFateTprHWl39zF&redirect_uri=oob&confirm_login=0. access_token 可以理解为调用接口的凭证（言外之意就是需要登陆后拿到 access_token 才能调用接口）
- 获取百度网盘文件列表：https://pan.baidu.com/rest/2.0/xpan/file?method=list&showempty=1. 在上边登陆后会注入一些 Cookie 到浏览器，发起请求时会附带上这些 cookie 

```json
{
  "errno": 0,
  "guid_info": "",
  "list": [
    {
      "tkbind_id": 0,
      "server_mtime": 1756480349,
      "category": 6,
      "unlist": 0,
      "isdir": 0,
      "oper_id": 0,
      "wpfile": 0,
      "local_mtime": 1756393369,
      "share": 0,
      "pl": 1,
      "local_ctime": 1756440195,
      "is_scene": 0,
      "black_tag": 0,
      "extent_int2": 0,
      "server_ctime": 1756440196,
      "extent_tinyint7": 0,
      "owner_id": 1000060896372,
      "size": 1046400227,
      "extent_int8": 0,
      "fs_id": 363098762170980,
      "path": "\/\u4e13\u5bb6\u8bfe\u4ef6",
      "owner_type": 1,
      "from_type": 0,
      "real_category": "7z",
      "md5": "367f4c4b8u47cca2e06ed50c159ed339",
      "server_atime": 0,
      "server_filename": "\u4e13\u5bb6\u8bfe\u4ef6"
    }
  ],
  "request_id": 9048196590350182171,
  "guid": 0
}
```
最后返回的一个 json 文件，list 里边就是百度网盘里边所出存储的所有文件（包括文件夹）
- 获得网盘直链下载链接：https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1. 接口需要额外传递几个 query 参数
  - `access_token(string)`：前置获取的登陆凭证
  - `fsids(string)`：需要获取直链下载的文件列表，这里需要注意的传递类型是 string, 比如有三个文件，未序列化前的是数据结构是 [fsid_1, fsid_2, fsid_3]，最后需要用 JSON.stringify 序列后再入参，否则会有 “**fsids error**” 异常

- 得到可下载的链接后，需要再拼接上 access_token 
```js
// dlink 为可直链下载的文件
const url = new URL(dlink)
url.searchParams.set('access_token', <access_token>)
```

拼接后可以通过 curl 或者其他途径下载，但是需要再加上 **`-A pan.baidu.com`** 的 agent 标识，接口应该是强校验请求发起方

## 结论

其实上边的步骤完成后就能免下载客户端下载百度网盘文件了，但是发现一个问题就是百度网盘本身对接口看上去是有网速限制，测试 50M 带宽的场景下居然最后只能到 100k/s 我也是醉了，所以这个只能是解决免安装下载的问题，并不能明显地提升下载速度。针对这种情况如果处理器的性能比较好的话可以是 `aria2` 多进行并行分片下载后再组装，大致如果 100k/s 的情况下最后能并行下载 10 个感觉就很可以了，效率也能比原来高不少

## 参考

[LinkSwift](https://github.com/hmjz100/LinkSwift)：一个基于 Javascript 网盘下载地址获取工具

