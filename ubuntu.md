# ubuntu 

> 初始安装 ubuntu 时遇到的一些问题，包括对一些目录、应用安装、环境配置等一些解决方案

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

### zsh

zsh 是比bash更为强大的shell，支持定制插件、主题等等

1. 安装 zsh

```bash
$ sudo apt-get install zsh
$ cat /etc/shells # 检验是否安装成功
```

2. 基于 oh-my-zsh 配置 zsh

```bash
$  wget sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

安装成功会覆盖 ~/.zshrc，具体一些插件定义以及主题配置可在里面配置

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
$ git clone https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/themes
```
```text
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
$ sudo apt-get install proxychians4
```

2. 修改 `/etc/proxychains4.conf`，在 ProxyList 下面修改对应连接协议的端口为 clash代理端口(前提是clash必须得先启动了)

```text
[ProxyList]
socks5  127.0.0.1 7890
# http   127.0.0.1 7890
# add proxy here ...
# meanwile
# defaults set to "tor"
socks4 	127.0.0.1 7890
```

3. 在每个需要走代理的命令前加上 proxychains4 即可

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





## 编程环境

### nvm

nvm是一个可以在系统中切换node版本的工具，相比单独安装node.exe更加方便可定制性更高

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



