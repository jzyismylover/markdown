# electron-builder



electron-builder：是一个可以跨平台打包桌面应用的打包工具，且支持应用程序的自动更新，支持打包格式

- all platform：7z, zip, tar.xz, tar.gz, tar.lz, tar.bz2, dir
- macos：dmg, pkg, mas, mas-dev
- linux：deb, rpm, apk, pacman, snap
- windows: nsis, portable, appx



## settings

electron-build 可通过传入 options 定义打包行为，可配置通用选项如下：

- appid：应用 id
- productName：应用打包名( `不允许出现空格和特殊字符 `)
- copyright：著作权( `Copyright © year ${author}` )

- beforePack(Function)：生成应用程序包前执行的回调函数
- afterPack(Function)：生成应用程序包后执行的回调函数
- directives(Object)：配置输出目录、资源目录
- ……



## macos

```js
const macOptions = {
  mac: {
    icon: './resources/icons/icon.icns',
    category: 'public.app-category.music',
  },
  dmg: {
    window: {
      width: 600,
      height: 400,
    },
    contents: [ // 定义图标位置
      {
        x: 106,
        y: 252,
        name: 'LX Music',
      },
      {
        x: 490,
        y: 252,
        type: 'link',
        path: '/Applications',
      },
    ],
    title: '',
  },
}
```



```js
  mac(arch, packageType) {
    switch (packageType) {
      case 'dmg':
        macOptions.artifactName = `\${productName}-\${version}-${arch}.\${ext}`
        return {
          buildOptions: { mac: ['dmg'] },
          options: macOptions,
        }
      default: throw new Error('Unknown package type: ' + packageType)
    }
  },
```





## windows

```js
const winOptions = {
  win: {
    icon: './resources/icons/icon.ico',
    legalTrademarks: 'lyswhut',
  },
  nsis: {
    oneClick: false, // 是否提供一键安装
    language: '2052',
    allowToChangeInstallationDirectory: true, // 是否允许用户更改安装目录。
    license: './licenses/license.rtf',
    shortcutName: 'LX Music', // 快捷方式名称
  },
}
```

windows 中比较常见是通过 .exe 启动安装程序安装应用.  nsis 可以通过一些选项帮助构建一个安装启动程序. 

```js
  win(arch, packageType) {
    switch (packageType) {
      case 'setup': // 安装程序
        winOptions.artifactName = `\${productName}-v\${version}-${arch}-Setup.\${ext}`
        return {
          buildOptions: { win: ['nsis'] },
          options: winOptions,
        }
      case 'green':
        winOptions.artifactName = `\${productName}-v\${version}-win_${arch}-green.\${ext}`
        return {
          buildOptions: { win: ['7z'] },
          options: winOptions,
        }
      case 'win7_green':
        winOptions.artifactName = `\${productName}-v\${version}-win7_${arch}-green.\${ext}`
        return {
          buildOptions: { win: ['7z'] },
          options: winOptions,
        }
      case 'portable':
        winOptions.artifactName = `\${productName}-v\${version}-${arch}-portable.\${ext}`
        return {
          buildOptions: { win: ['portable'] },
          options: winOptions,
        }
      default: throw new Error('Unknown package type: ' + packageType)
    }
  },
```





## linux

```js
const linuxOptions = {
  linux: {
    maintainer: 'lyswhut <lyswhut@qq.com>',
    icon: './resources/icons',
    category: 'Utility;AudioVideo;Audio;Player;Music;',
    desktop: {
      Name: 'LX Music',
      'Name[zh_CN]': 'LX Music',
      'Name[zh_TW]': 'LX Music',
      Encoding: 'UTF-8',
      MimeType: 'x-scheme-handler/lxmusic',
      StartupNotify: 'false',
    },
  },
  appImage: {
    license: './licenses/license_zh.txt',
    category: 'Utility;AudioVideo;Audio;Player;Music;',
  },
}
```

linux 有很多不同发行版，像 debian、archlinux、redhat，不同发行版基于不同包管理器管理应用包安装

```js
  linux(arch, packageType) {
    switch (packageType) {
      case 'deb':
        linuxOptions.artifactName = `\${productName}_\${version}_${arch == 'x64' ? 'amd64' : arch}.\${ext}`
        return {
          buildOptions: { linux: ['deb'] },
          options: linuxOptions,
        }
      case 'appImage':
        linuxOptions.artifactName = `\${productName}_\${version}_${arch}.\${ext}`
        return {
          buildOptions: { linux: ['AppImage'] },
          options: linuxOptions,
        }
      case 'pacman':
        linuxOptions.artifactName = `\${productName}_\${version}_${arch}.\${ext}`
        return {
          buildOptions: { linux: ['pacman'] },
          options: linuxOptions,
        }
      case 'rpm':
        linuxOptions.artifactName = `\${productName}-\${version}.${arch}.\${ext}`
        return {
          buildOptions: { linux: ['rpm'] },
          options: linuxOptions,
        }
      default: throw new Error('Unknown package type: ' + packageType)
    }
  }
```



## upgrade



electron 更新分为全量更新 & 增量更新

- 全量更新：一般用于大版本更新（存在破坏性改动），需要重新下载整个安装包执行应用安装程序
- 增量更新：一般用于小版本更新，下载部分数据组装成新的安装包



### 全量更新

```js
version: 0.0.1ZHANGZHANG
files:
  - url: data-platform_setup_0.0.1.exe
    sha512: xI8sHN39xAwKhKGD4k21m6/C/Zap9H3OMjvdWeeCqfmjGe6TA+6lEYLeI9woaJmNIQM0r90hhmFObWC9ejFbjQ==
    size: 57384371
path: data-platform_setup_0.0.1.exe
sha512: xI8sHN39xAwKhKGD4k21m6/C/Zap9H3OMjvdWeeCqfmjGe6TA+6lEYLeI9woaJmNIQM0r90hhmFObWC9ejFbjQ==
releaseDate: '2021-05-29T15:00:33.861Z'
```

- version：记录最新版本号
- sha512：安装包 sha512
- path：安装包下载链接



解决思路：应用启动的时候获取服务器 *.yml 文件，对比当前本地版本，如果有版本更新则从服务器获取新的安装包。



### 增量更新

> 增量更新有两种：asar、blockmap



#### asar



#### blockmap







# build

> electron-build 仅仅是作为生成对应平台对应架构二进制程序包的工具，并不能帮助我们打包编译、打包前端项目，这一套流程还是需要借助 webpack / vite 等一些前端领域的构建工具

应用 build 过程可以理解为是应用源码构建过程，分为两个阶段：

- 主进程构建：构建入口为 electron 启动文件
- 渲染进程构建：构建入口为 main.js



# all

目前其实有一些已经集成好的工具可以使用，`vite-electron-builder`、`electron-vue-vite`…… 同时也作为项目启动的脚手架，通过暴露一些配置选项帮助定制 build & pack 的行为，自行编写可参考 `lx-music`  —— 基于 webpack 使用多线程并行打包

