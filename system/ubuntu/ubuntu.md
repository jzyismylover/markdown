# ubuntu 

> 初始安装 ubuntu 时遇到的一些问题，包括对一些目录、应用安装、环境配置等一些解决方案



🔐 关于 `UEFI` & `BIOS` 启动理解

- `BIOS`：用于加载电脑最基本的程式码，担负着初始化硬件，检测硬件功能以及引导操作系统的任务
- `UEFI`：用于操作系统自动从预启动的操作环境加载到一种操作系统上

`UEFI` 相比于`BIOS `，可以直接读取 `FAT	` 分区的文件，因此在启动系统的时候不需要再在 `BIOS `中读取指定扇区的代码然后从活动分区启动操作系统。完全可以开发直接在 `UEFI ` 运行的应用程序，直接在启动的时候读取执行，在重装系统的时候只需插入 `制作好系统的U盘`直接运行启动即可。



## 存储库

> ubuntu 软件有多种形式可用 DEB软件包，AppImage，Flatpak Snap…

实际在 `apt install` 的时候 `ubuntu` 会从 `main` 存储库寻找下载内容 —— 通常这些安装包都是 `ubuntu` 社区在维护

对于一些第三方包，可以通过`添加软件仓库`来保证在安装的时候能够检索到对应的包

```bash
$ sudo add-apt-repository [repository-link]
```

具体来说：

- 添加新的软件源到系统中。`软件源`是一个网络服务器，存储着一组软件包，用户可以从中下载和安装软件。添加新的软件源可以扩展系统的软件包选择范围。
- 自动更新系统的软件源列表。这样，系统就知道从哪些软件源获取软件包的更新和安装
- 在添加新的软件源时自动导入软件源的 `GPG` 密钥。`GPG` 密钥用于验证软件包的完整性和真实性，确保用户安装的软件没有被篡改



## 目录

### /etc/shells
该目录主要包含了ubuntu系统支持的终端
```bash
$ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/bash
/usr/bin/bash
/bin/rbash
/usr/bin/rbash
/usr/bin/sh
/bin/dash
/usr/bin/dash
/bin/zsh
/usr/bin/zsh
```

### /usr/bin

apt-get/dpkg 安装的软件可执行文件存放的地方

### /usr/share

apt-get/dpkg 安装软件软件软件夹存放位置

### /usr/share/applications

desktop 对应图标的一些具体信息，包括图标命名、点击后执行哪个目录下的启动文件、icon...

```bash
# qqmusic.desktop
[Desktop Entry]
Name=qqmusic
Exec=/opt/qqmusic/qqmusic --no-sandbox %U
Terminal=false
Type=Application
Icon=qqmusic
StartupWMClass=qqmusic
Comment=Tencent QQMusic
Categories=AudioVideo;
```

> 既然说到了 qqmusic，实际在启动的时候遇到闪退问题，那么实际是因为 desktop 软件启动的时候默认会给应用一个sandbox来限制其行为，而electron中默认也会给渲染进程启动一个sandbox，我理解的花就是外层desktop加的sandbox阻塞了electron和操作系统的通信而导致应用无法正常加载页面，因此需要在启动的时候默认不加上 sandbox，即上面 `--no-sandbox` 的配置 



## 蓝牙连接

[解决问题方法](https://devicetests.com/fixing-bluetooth-connection-issues-ubuntu)

- 安装对应的依赖包

  ```bash
  $ sudo apt-get update
  $ sudo apt-get upgrade
  $ sudo apt-get install blueman
  ```

- 重新启动蓝牙服务

  ```bash
  $ sudo systemctl restart bluetooth
  ```

- 开启蓝牙高速连接

  ```bash
  $ sudo vim /etc/bluetooth/main.conf
  ```

  设置`FastConnectable=true` 

- 连接蓝牙

  ```bash
  bluetoothctl # 启动 cli
  power on # 启动蓝牙控制器
  agent on # 启动蓝牙代理
  devices # 查看设备 MAC 地址
  pair <mac address of your device> # 配对该MAC设备
  trust <mac address of your device> # 信任该MAC设备
  connect <mac address of your device> # 连接该MAC设备
  ```

![image-20231201204627331](/home/jzy/Documents/markdown/ubuntu.assets/image-20231201204627331.png)

> connect 24:81:C7:FD:21:0E





## 软件安装

### docker

**[教程](https://phoenixnap.com/kb/install-docker-on-ubuntu-20-04)**

1. 准备工作

```bash
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common -y # 下载docker必要包
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - #将Docker存储库GPG密钥添加到您的系统中
```

2. 添加 docker 仓库到下载源

```bash
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"	
$ apt-cache policy docker-ce
```

3. 下载 docker

```bash
$ sudo apt install docker-ce -y
$ sudo systemctl status docker
```

> 下载完成之后其实每次运行 docker 都需要 sudo，因为默认 docker 属于 docker 组，因此除了 root / docker其他不能进行读写，因此把当前用户加入组即可

```bash
$ sudo usermod -aG docker ${USER}
$ sudo systemctl restart docker
```

4. 安装 docker-compose  [**参考**](https://www.51cto.com/article/715086.html)

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose # 版本可替换为最新
$ sudo chmod +x /usr/local/bin/docker-compose
```



### vscode

vscode 的安装总体较为简单，对应在官网下载对应的 deb 包然后安装即可

```bash
$ sudo dpkg -i [.deb]
```

- `setting.json` 配置

```json
{
  //### Basic Setting ###
  "terminal.integrated.defaultProfile.linux": "zsh",
  "terminal.integrated.fontFamily": "MesloLGS NF",
  "files.autoSave": "afterDelay",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "explorer.confirmDelete": false,
  "workbench.iconTheme": "vscode-icons",
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "editor.fontSize": 14.8,
  "terminal.integrated.inheritEnv": false,
  "http.proxyAuthorization": "false",

  // ### Lint Setting ###
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  // ### Leetcode Setting ###
  "leetcode.endpoint": "leetcode-cn",
  "leetcode.workspaceFolder": "/home/jzy/Desktop/programmer/leetcode",
  "leetcode.defaultLanguage": "javascript",
  // ### Markdown Setting ###
  "markdown.preview.fontSize": 15.5,
  "markdown.preview.fontFamily": "MesloLGS NF",
  "leetcode.hint.configWebviewMarkdown": false,
  "leetcode.hint.commandShortcut": false
}

```





### zsh

zsh 是比bash更为强大的shell，支持定制插件、主题等等

1. 安装 zsh

```bash
$ sudo apt-get install zsh
$ cat /etc/shells # 检验是否安装成功
```

2. 基于 oh-my-zsh 配置 zsh

```bash
# 国外镜像
$  wget sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
# 国内镜像
sh -c "$(wget -O- https://gitee.com/pocmon/mirrors/raw/master/tools/install.sh)"
```


3. 配置 oh-my-zsh 主题

```bash
# ~/.zshrc
ZSH_THEME='agnoster'
```

> 主题配置后会出现终端无法显示主题图标问题，搜索后发现是字体类型不对，因此需要重新下载 [Ubuntu mono](https://github.com/powerline/fonts/blob/master/UbuntuMono/Ubuntu%20Mono%20derivative%20Powerline%20Bold.ttf) 并完成安装，在 终端`preference/unnamed/text`下面选择该字体并重新启动当前终端，当然下载该字体应用前需要下载 powerline 支持
```bash
$ sudo apt-get install fonts-powerline
```

4. 配置 oh-my-zsh 插件

```bash
$ git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
$ git clone https://github.com/wting/autojump $ZSH_CUSTOM/plugins/autojump
$ cd $ZSH_CUSTOM/plugins/autojump
$ ./install.py # 必须包含 python 环境
```

```bash
# ~/.zshrc
plugins=(
    git
    zsh-syntax-highlighting
    zsh-autosuggestions
    autojump
)
#需要加上一段必要代码(完成./install.py后终端会有相关提示)
```

5. 配置 zsh 为默认 shell

```bash
$ chsh -s /bin/zsh # 生效需 reboot后
```

> :warning: 当我们把默认终端设为 bash 后，我们会发现 .bashrc 不被加载了，所以在 .bashrc 里面安装的一些环境变量在 zsh 也无法使用了。因此如果想在两边的环境变量配置都生效的话，就把这些配置写在 `~/.profile` 里面。

但是 zsh 启动的时候默认也不会加载 ~/.profile，因此需要手动在配置里面加载

```bash
# ~/.zshrc
+ [[ -e ~/.profile ]] && emulate sh -c 'source ~/.profile'
```

6. 配置 powerlevel10 主题

```bash
$ git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```
```bash
# ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"
```
配置主题样式
```bash
$ p10k configure
```
更多颜色定制可参考 [教程](https://blog.csdn.net/Lijuejie/article/details/111567856)。整体在配置的过程中也遇到了 ubuntu 终端无法设置新下载字体的问题(MesloLGS无法正常应用包括其他字体也是)。
那么实际在解决问题的时候也没有遇到比较好的方法，最后也是从 [github](https://github.com/fontmgr/MesloLGSNF/blob/main/fonts/MesloLGS%20NF%20Italic.ttf) 把里面的所以 Meslogs 字体全部下载下来才最后能应用的上，这个真的好坑呀！
当然其实 [官网](https://github.com/romkatv/powerlevel10k#how-was-the-recommended-font-created) 也给了 Meslogs 字体的下载方式，只是自己没有看仔细！！！
```bash
$ git clone --depth=1 https://github.com/romkatv/nerd-fonts.git
cd nerd-fonts
./build 'Meslo/S/*'
```



### clash

clash 是一个管理代理的工具，在 windows/macos上都有图形化界面，在 linux 上可能更多还是在命令行中配置

1. 当然首先还是得把 clash.gz 下载到本地 [下载链接](https://github.com/Dreamacro/clash/releases)

2. 解压缩 .gz 文件

```bash
$ gzip -d [.gz] # 会删除 gz 文件
```

3. 当然这时候解压缩得到的就是一个可执行文件了。当前还缺少 clash 配置文件，因此需要在windows端通过UI导出配置并重命名为 `config.yaml` 拷贝到 ubuntu 中 `~/.config/clash`

   > 当然也可以在实际执行 clash 的时候使用 -f 选项制定 yaml 文件

4. 将当前可执行文件映射到 `/usr/bin/clash`，以后在终端直接执行 clash 即可

```bash
$ ln [clash解压缩所在目录]/clash-linux-amd64-v1.15.1 /usr/bin/clash
```

### proxychains

proxychains 是一个强大的代理工具(在终端也能进行指定代理服务)

1. 安装 proxychains4

```bash
$ sudo apt-get install proxychains4
```

2. 修改 `/etc/proxychains4.conf`，在 `ProxyList` 下面修改对应连接协议的端口为 clash代理端口(前提是clash必须得先启动了)

```text
[ProxyList]
socks5  127.0.0.1 7890
# http   127.0.0.1 7890
# add proxy here ...
# meanwile
# defaults set to "tor"
socks4 	127.0.0.1 7890
```

3. 在每个需要走代理的命令前加上 `proxychains4` 即可

```bash
$ proxychains4 sudo apt-get update
```

### wechat

1. 基于 `bestwu/wechat` 镜像

```yaml
version: '3'
networks:
  wechat:
    driver: bridge
    name: wechat

services:
  wechat:
    image: bestwu/wechat
    container_name: wechat
    networks:
      - wechat # 自定义网络
    devices:
      - /dev/snd # 声卡
    volumes:
      - /tmp/.X11-unix:/tmp/.X11-unix 
      - $HOME/WeChatFiles:/WeChatFiles # 文件存储
    environment:
      - DISPLAY=unix$DISPLAY
      - QT_IM_MODULE=ibus # 基于系统使用的是 ibus
      - XMODIFIERS=@im=ibus
      - GTK_IM_MODULE=ibus
      - AUDIO_GID=63 # 可选 默认63（fedora） 主机audio gid 解决声音设备访问权限问题
      - GID=1000 # 可选 默认1000 主机当前用户 gid 解决挂载目录访问权限问题
      - UID=1000 # 可选 默认1000 主机当前用户 uid 解决挂载目录访问权限问题
```

> 但其实使用的时候会发现有很多问题，包括截图无法正常发送，要拷贝到 wechatFiles/fileStorage/Files 目录下然后在 wechat 上上传才可以。而且凡是涉及到文件传输就会出现闪退，实用性不高！

2. 基于`zixia/wechat` 镜像

```dockerfile
docker run \
  --name DoChat \
  --rm \
  -i \
  \
  -v "$HOME/DoChat/WeChat Files/":'/home/user/WeChat Files/' \
  -v "$HOME/DoChat/Applcation Data":'/home/user/.wine/drive_c/users/user/Application Data/' \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  \
  -e DISPLAY \
  \
  -e XMODIFIERS=@im=ibus \
  -e GTK_IM_MODULE=ibus \
  -e QT_IM_MODULE=ibus \
  -e GID=1000 \
  -e UID=1000 \
  \
  --ipc=host \
  --privileged \
  \
  zixia/wechat
```



### typora

> 非常好用的markdown编辑工具

1. 安装

```bash
$ sudo snap install typora
```

可通过命令行安装也可以通过 software 可视化安装，安装完其实激活就可以使用。

使用的时候其实我之前一直觉得比较鸡肋的地方就是里面我放了截图，但实际发给别人的时候就看不到这些截图了。但实际可以通过 **[picgo](https://picgo.github.io/PicGo-Core-Doc/zh/guide/commands.html#config-set)** 来解决这个问题。

```bash 
$ npm install -g picgo
```

- 选择图床远程仓库

```bash
$ picgo use
```

- 配置模块内容

```bash
$ picgo set uploader
```

- 最终配置

```json
{
  "picBed": {
    "uploader": "github",
    "current": "github",
    "transformer": "path",
    "gitee": {
      "owner": "jzy",
      "repo": "https://gitee.com/jzyislover/typora-image-store.git",
      "path": "",
      "token": "",
      "message": ""
    },
    "github": {
      "repo": "jzyismylover/picgo-image-store",
      "branch": "master",
      "token": "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",
      "path": "images_", // 指定了图片前缀
      "customUrl": "n"
    }
  },
  "picgoPlugins": {
    "picgo-plugin-gitee": false // gitee图床插件
  }
}

```



> :warning: 实际完成上面在 typora 配置的时候就遇到问题了

<img src="https://s2.loli.net/2023/06/07/3jOEDBkP1UuvY5g.png" alt="Screenshot from 2023-06-07 00-21-37"  />

因为是基于 `picgo-core` ，因此只能使用自定义命令（**格式是 [node] [picgo] u**)，但是由于 `typora` 使用 snap 安装，并没有权限读取除了 ~/snap & ~/media 外的其他目录，因此在实际验证图片上传选项会出现 `permission denine`。解决的方案：

```bash 
# 先使用硬链接保证能访问 node 
$ ln $(which node) ~/snap/typora/80/node
```

用同样的方式链接 `picgo` 发现不行，因为啊其实 `$(which picgo)` 其实是一个软链接文件，作为快捷方式访问由于 `snap` 依然无权限

```bash
$ cd /home/jzy/.nvm/versions/node/v18.16.0/bin/      
$ ll
total 87M
lrwxrwxrwx 1 jzy jzy  45  4月 12 13:31 corepack -> ../lib/node_modules/corepack/dist/corepack.js
lrwxrwxrwx 1 jzy jzy  43  5月 22 15:48 nest -> ../lib/node_modules/@nestjs/cli/bin/nest.js
-rwxr-xr-x 2 jzy jzy 87M  4月 12 13:31 node
lrwxrwxrwx 1 jzy jzy  38  4月 12 13:31 npm -> ../lib/node_modules/npm/bin/npm-cli.js
lrwxrwxrwx 1 jzy jzy  38  4月 12 13:31 npx -> ../lib/node_modules/npm/bin/npx-cli.js
*lrwxrwxrwx 1 jzy jzy  35  6月  6 21:08 picgo -> ../lib/node_modules/picgo/bin/picgo
lrwxrwxrwx 1 jzy jzy  37  6月  6 16:34 pnpm -> ../lib/node_modules/pnpm/bin/pnpm.cjs
lrwxrwxrwx 1 jzy jzy  37  6月  6 16:34 pnpx -> ../lib/node_modules/pnpm/bin/pnpx.cjs
lrwxrwxrwx 1 jzy jzy  38  6月  1 18:21 tsc -> ../lib/node_modules/typescript/bin/tsc
lrwxrwxrwx 1 jzy jzy  43  6月  1 18:21 tsserver -> ../lib/node_modules/typescript/bin/tsserver
```

因此采取的解决方案就是整体进入到 `../lib/node_modules`

```bash
$ cp -r picgo ~/snap/typora/80/picgo
```

然后配置 `command line` ，然后就 ok 了！

```bash
# ~ 指的是 ~/snap/typora/80
~/node ~/picgo/bin/picgo u
```



### git

1. 安装 `git`

```bash
$ sudo apt update
$ sudo apt-get install git
```

2. 配置 `git`

```bash
$ git -v # 验证是否安装成功
$ git config --global user.name "jzyismylover"
$ git config --global user.email "3011543110@qq.com"
```

3. 生成密钥（连接 `github` / `gitlab` 仓库）

```bash
$ sudo apt install ssh
$ ssh-keygen -t rsa -C "附加信息 一般为邮箱"
```

> 拓展：如何同时配置 `github` 和 `gitlab` 私钥

1. `ssh-keygen` 先生成一个 `gitlab` 公私钥 `id_rsa`、`id_rsa.pub`
2. `ssh-keygen` 在生成一个 `github` 公私钥

```bash
$ ssh-keygen -t rsa -C "3011543110@qq.com" -f ~/.ssh/github_rsa
```

此时会生成两个文件 `github_rsa` 和 `github_rsa.pub`

3. 配置 `~/.ssh/config`

```bash
# github账号配置
Host github.com 
port 22 
User git 
HostName github.com 
PreferredAuthentications publickey 
IdentityFile ~/.ssh/github_rsa 

# gitlab账号配置(HostName为公司gitlab地址) Host gitlab.com 
port 22 
User git 
HostName gitlab.xxx.com User git 
PreferredAuthentications publickey 
IdentityFile ~/.ssh/id_rsa
```

对应参数[说明](https://daemon369.github.io/ssh/2015/03/21/using-ssh-config-file)：

- Host：识别的模式，对识别的模式，配置对应的主机名和ssh文件 
- Port 自定义的端口。默认为22，可不配置 
- User 自定义的用户名，默认为git，可不配置 
- HostName 真正连接的服务器地址 
- PreferredAuthentications 指定优先使用哪种方式验证，支持密码和秘钥验证方式 
- IdentityFile 指定本次连接使用的密钥文件



### ffmpeg

`FFmpeg` 是一个自由的开放源代码工具集，用于处理多媒体文件。它包含一组共享的音频和视频库，例如 `libavcodec`，`libavformat`和`libavutil`。使用`FFmpeg`，您可以在各种视频和音频格式之间转换，设置采样率，捕获流音频/视频以及调整视频大小。 [docs](https://www.ffmpeg.org/ffmpeg.html)

```bash
$ sudo apt update
$ sudo apt install ffmpeg
$ ffmpeg -version
$ ffmpeg -encoders
```

- 将 `mp4` 转换为 `webm`

  ```bash
  $ ffmpeg -i input.mp4 output.webm
  ```

- 将 `mp3` 转换为 `ogg`

  ```bash
  $ ffmpeg -i input.mp3 output.ogg
  ```




### vmware

> 虚拟机软件，安装 `win`系统 用于补充 `ubuntu` 软件支持度不够问题 [安装教程](https://linuxhint.com/install-vmware-workstation-17-pro-ubuntu-22-04-lts/)

密钥激活

`4A4RR-813DK-M81A9-4U35H-06KND`

`NZ4RR-FTK5H-H81C1-Q30QH-1V2LA`

`JU090-6039P-08409-8J0QH-2YR7F`

`4Y09U-AJK97-089Z0-A3054-83KLA`

`4C21U-2KK9Q-M8130-4V2QH-CF810`

`MC60H-DWHD5-H80U9-6V85M-8280D`



在 `Ubuntu` 中，启动 `windows` 或者是其他系统都会出现 `VMware Linux - Could not open dev vmmon: No such file or directory.Please make sure that the kernel module vmmon` ，本质上是需要的组件需要签名后才能使用。准备一个可执行文件

```sh
#!/bin/bash

filename_key="VMWARE16"
cd /home/jzy/Documents/signature
sudo openssl req -new -x509 -newkey rsa:2048 -keyout ${filename_key}.priv -outform DER -out ${filename_key}.der -nodes -days 36500 -subj "/CN=VMware/"
sudo /usr/src/linux-headers-`uname -r`/scripts/sign-file sha256 ./${filename_key}.priv ./${filename_key}.der $(modinfo -n vmmon)
sudo /usr/src/linux-headers-`uname -r`/scripts/sign-file sha256 ./${filename_key}.priv ./${filename_key}.der $(modinfo -n vmnet)
sudo mokutil --import ${filename_key}.der 
echo "NEXT STEPS: reboot > select 'Enroll MOK' > follow prompts to enter password > reboot"
```

- 执行文件完成组件签名就可以重启电脑然后选择 `Enroll Mok` 选项勾选即可

```bash
$ chomd 700 ./signature.sh
$ ./signature.sh
$ reboot
```



### libglu1

压缩图片的工具 [官方文档 ](https://developers.google.com/speed/webp/docs/using?hl=zh-cn) [包下载链接](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html)

```bash
$ sudo apt install lidglu1
$ sudo apt install libxi6 libgconf-2-4
```

> 以上主要是解决找不到 `dll` 的问题



### tree-node-cli

获取目录树 [juejin](https://juejin.cn/post/6869586796435472397)

```bash
$ npm install -g tree-node-cli
```





## 编程环境

### nvm

nvm 是一个可以在系统中切换node版本的工具，相比单独安装node.exe 更加方便可定制性更高

```bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | zsh
$ nvm --version # 无效 可重启终端
```

```bash
$ nvm ls-remote # 查看可安装 node 版本
$ nvm install v18.8.0 # 安装 node v18版本
$ nvm ls # 查看当前安装了的 node
$ nvm use [version] # 具体使用哪个版本的 node 
```

> 当然加入上面使用了 bash 去初始化的话只需把对应 nvm 启动配置从 `~/.bashrc` 克隆到 `~/.zshrc` 即可

### anaconda

conda是一个包管理工具及python环境管理工具，anaconda是conda最大的发行版本，anaconda 内含数据科学和机器学习要用到的很多软件

1. 安装 anaconda

```bash
$ wget https://mirrors.bfsu.edu.cn/anaconda/archive/Anaconda3-2022.10-Linux-x86_64.sh --no-check-certificate -P ~/Downloads
$ zsh Anaconda3-2021.11-Linux-x86_64.sh
```

2. 应用环境变量

```bash
$ source ~/.bashrc # 初始会存在一个 base 环境
$ conda config --set auto_activate_base false # 配置默认不进入base环境(即不存在python环境)
```



> :warning: 以上 是基于 anaconda 的安装过程，但是整体 anaconda 体积比较大，而作为web开发工作者其实并不需要包含这么多机器学习相关依赖，因此可以考虑下载 `miniconda`。`miniconda`体积小，仅仅包含基础的 conda 以及 python 环境。

```bash
$ wget -c https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
$ chmod +x Miniconda3-latest-Linux-x86_64.sh
$ zsh Miniconda3-latest-Linux-x86_64.sh
```

3. 常用命令
```bash
#创建虚拟环境
conda create -n your_env_name python=X.X（3.6、3.7等）
 
#激活虚拟环境
source activate your_env_name(虚拟环境名称)
 
#退出虚拟环境
source deactivate your_env_name(虚拟环境名称)
 
#删除虚拟环境
conda remove -n your_env_name(虚拟环境名称) --all
 
#查看安装了哪些包
conda list
 
#安装包
conda install package_name(包名)
conda install scrapy==1.3 # 安装指定版本的包
conda install -n 环境名 包名 # 在conda指定的某个环境中安装包
 
#查看当前存在哪些虚拟环境
conda env list 
#或 
conda info -e
#或
conda info --envs
 
#检查更新当前conda
conda update conda
 
#更新anaconda
conda update anaconda
 
#更新所有库
conda update --all
 
#更新python
conda update python
```



### compose

> docker-compose 启动应用 mysql、wechat、redis、nginx

- `mysql`

  ```yml
  version: "3"
  
  services:
    mysql:
      image: mysql
      # restart: always
      container_name: mysql
      environment:
        MYSQL_ROOT_PASSWORD: jzy
        TZ: Asia/Shanghai
      ports:
        - 5506:3306
      volumes:
        - ~/docker-compose/mysql/data:/var/lib/mysql
        - ~/docker-compose/mysql/config/my.cnf:/etc/mysql/my.cnf
      command: 
        --max_connections=1000
        --character-set-server=utf8mb4
        --collation-server=utf8mb4_general_ci
        --default-authentication-plugin=mysql_native_password
  ```

- `wechat`

  ```yml
  version: '2'
  networks:
    wechat:
      driver: bridge
      name: wechat
  
  services:
    wechat:
      image: bestwu/wechat
      container_name: wechat
      networks:
        - wechat
      devices:
        - /dev/snd
      volumes:
        - /tmp/.X11-unix:/tmp/.X11-unix
        - $HOME/WeChatFiles:/WeChatFiles
      environment:
        - DISPLAY=unix$DISPLAY
        - QT_IM_MODULE=ibus
        - XMODIFIERS=@im=ibus
        - GTK_IM_MODULE=ibus
        - AUDIO_GID=63 # 可选 默认63（fedora） 主机audio gid 解决声音设备访问权限问题
        - GID=1000 # 可选 默认1000 主机当前用户 gid 解决挂载目录访问权限问题
        - UID=1000 # 可选 默认1000 主机当前用户 uid 解决挂载目录访问权限问题
  ```

- `redis`

  - `download` redis [配置文件](https://download.redis.io/releases/) 并修改

  ```yml
  ### 指定redis绑定的主机地址，注释掉这部分，使redis可以外部访问
      # bind 127.0.0.1 -::1
  ### 指定访问redis服务端的端口
      port 6379
  ### 指定客户端连接redis服务器时，当闲置的时间为多少（如300）秒时关闭连接（0表示禁用）
      timeout 0
  ### 默认情况下，Redis不作为守护进程运行。如果需要，请使用“yes”
      daemonize no
  ### 给redis设置密码，不需要密码的话则注释
      # requirepass foobared
  ### 开启redis持久化，默认为no
      appendonly yes
  ```

  - `compose` 启动文件

  ```yml
  version: '3.4'
  
  services:
    redis:
      image: redis:7.0.2-alpine # 指定服务镜像，最好是与之前下载的redis配置文件保持一致
      container_name: redis # 容器名称
      restart: on-failure # 重启方式
      environment:
        - TZ=Asia/Shanghai # 设置时区
      volumes: # 配置数据卷
        - ~/docker-compose/redis/data:/data
        - ~/Download/software/redis-7.0.2/redis.conf:/etc/redis/redis.conf
      ports: # 映射端口
        - "6379:6379"
      sysctls: # 设置容器中的内核参数
        - net.core.somaxconn=1024
      command: redis-server /etc/redis/redis.conf --appendonly yes --requirepass jzyismylover # 指定配置文件并开启持久化
      privileged: true # 使用该参数，container内的root拥有真正的root权限。否则，container内的root只是外部的一个普通用户权限
  ```

- `nginx`

  ```yml
  version: '3'
  
  networks:
    nginx:
       external: true
       name: nginx
          
  services:
    nginx:
      image: nginx:latest
      ports:
        - 8088:80
      volumes:
        - /home/jzy/nginx:/etc/nginx
      networks:
        - nginx
  ```




### pnpm

1. 卸载 nvm 依赖

   ```bash
   $ rm -rf ~/.nvm
   ```

2. 下载 pnpm

   ```bash
   wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
   ```

   





## 命令



### xrandr

`xrandr`可以用于查看当前显示器的信息（包括当前屏幕和外接屏幕）。

> 实际在设置屏幕扩展或者复制的时候不能像 windows 一样通过 UI 进行操作，因此需要基于 `xrandr` 手动操作

- `xrandr` 输出

```bash
$ xrandr
Screen 0: minimum 16 x 16, current 1920 x 1080, maximum 32767 x 32767
XWAYLAND0 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 340mm x 190mm
   1920x1080     59.96*+
   1440x1080     59.87  
   1400x1050     59.86  
   1280x1024     59.89  
   1280x960      59.94  
   1152x864      59.78  
   1024x768      59.92  
   800x600       59.86  
   640x480       59.38  
   320x240       59.52  
   1680x1050     59.95  
   1440x900      59.89  
   1280x800      59.81  
   720x480       59.71  
   640x400       59.20  
   320x200       58.96  
   1600x900      59.95  
   1368x768      59.88  
   1280x720      59.86  
   1024x576      59.90  
   864x486       59.92  
   720x400       59.55  
   640x350       59.77 
```

XWAYLAND0 就是目前计算机的显示器别名

- 复制屏幕

```bash
# HDMI-1-1 为接入显示器后屏幕名
$ xrandr --output HDMI-1-1 --same-as XWAYLAND0 --auto
```

- 设置 HDMI 为右扩展屏幕

```bash
$ xrandr --output HDMI-1-1 --right-of XWAYLAND0 --auto 
```

### [tmux](https://zhuanlan.zhihu.com/p/98384704)

>  终端切换工具，非常好用！它的作用主要是创建一个脱离于当前终端的窗口使得会话与终端窗口分离，他则作为一个桥梁。

```bash
$ tmux new -s <name> # 创建一个窗口
$ tmux detach # 退出当前 tmux 窗口
$ tmux attach -t <name> # 重新进入 tmux 窗口(记录保留)
$ tmux kill-session -t <name> # 彻底销毁 tmux 窗口
$ tmux switch -t <name> # 在一个tmux窗口进入到另外一个tmux窗口
```



### alias

> :key: 可用于配置复杂命令参数快捷使用方式

- `curl` 发送 `POST` 请求

  以下配置在 `~/.zshrc` 

  ```bash
  # 基于 json 格式的 post 请求
  alias curlpost='request(){curl -X POST -H "Content-Type: application/json" -d $2 $1}; request'
  ```

  普通 `alias` 配置不支持外部传入参数，因此可以配置成函数的形式接收外部参数





## 日常使用



### 快捷键

> `super` 其实就是电脑上的 `win`



- `super` ：打开活动搜索界面
- `ctrl + alt + t`：打开终端
- `super + l`：🔓屏
- `super + d`：显示桌面
- `super + a`：显示应用菜单
- `super + tab / alt + tab`：应用切换
- super + `：相同应用不同窗口切换
- `super + 箭头`：移动窗口位置
  - `super + <` 使当前窗口紧贴左边缘
  - `super + >` 使当前窗口紧贴右边缘
  - `super + 👆`  使当前窗口全屏
  - `super + 👇`：使当前窗口缩小
- `super + m`：切换到通知栏
- `super + 空格`：切换输入法



### hosts

`hosts` 文件是处理 `DNS` 相关，我们可以通过写入映射来实现通过 `ip` 访问域名的情况。`ubuntu` 的 `host` 文件位于 `/etc/hosts`

1. 查看域名对应 `ip`

```bash
$ nslookup [domain name]
```

2. 刷新 `DNS` 配置 `

```bash
$ sudo apt install nscd 
$ sudo /etc/init.d/nscd restart
```

