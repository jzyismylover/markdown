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

<<<<<<< HEAD
> 主题配置后会出现终端无法显示主题图标问题，搜索后发现是字体类型不对，因此需要重新下载 [Ubuntu mono](https://github.com/powerline/fonts/blob/master/UbuntuMono/Ubuntu%20Mono%20derivative%20Powerline%20Bold.ttf) 并完成安装，在 终端`preference/unnamed/text`下面选择该字体并重新启动当前终端，当然下载该字体应用前需要下载 powerline 支持
```bash
$ sudo apt-get install fonts-powerline
```

=======
> 主题配置后会出现终端无法显示主题图标问题，搜索后发现是字体类型不对，因此需要重新下载 [Ubuntu mono](https://github.com/powerline/fonts/blob/master/UbuntuMono/Ubuntu%20Mono%20derivative%20Powerline%20Bold.ttf) 并完成安装，在 终端`preference/unnamed/text`下面选择该字体并重新启动当前终端
>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6

4. 配置 oh-my-zsh 插件

```bash
$ git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
<<<<<<< HEAD
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
=======
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting $ZSH_CUSTOM/plugins/zsh-autosuggestions
>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6
$ git clone https://github.com/wting/autojump $ZSH_CUSTOM/plugins/autojump
$ cd $ZSH_CUSTOM/plugins/autojump
$ ./install.py # 必须包含 python 环境
```

```bash
# ~/.zshrc
plugins=(
<<<<<<< HEAD
    git
=======
	git
>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6
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
<<<<<<< HEAD
=======

>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6
```bash
# ~/.zshrc
+ [[ -e ~/.profile ]] && emulate sh -c 'source ~/.profile'
```

<<<<<<< HEAD

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



=======
>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6
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

<<<<<<< HEAD
以上是基于 anaconda 的安装过程，但是整体 anaconda 体积比较大，而作为web开发工作者其实并不需要包含这么多机器学习相关依赖，因此可以考虑下载 `miniconda`

```bash
$ wget -c https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
$ chmod +x Miniconda3-latest-Linux-x86_64.sh
$ zsh Miniconda3-latest-Linux-x86_64.sh
```


> 常用命令
=======
3. 常用命令
>>>>>>> aa1bb941897fb6d7eff7df67597291be9f73cce6

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

