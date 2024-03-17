(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{363:function(s,a,t){s.exports=t.p+"assets/img/image-20230707112348574.f32ad271.png"},364:function(s,a,t){s.exports=t.p+"assets/img/image-20230707163357057.1f565531.png"},365:function(s,a,t){s.exports=t.p+"assets/img/image-20230707163743203.1423d130.png"},366:function(s,a,t){s.exports=t.p+"assets/img/image-20230707165416688.5aff05cf.png"},367:function(s,a,t){s.exports=t.p+"assets/img/image-20230711210420142.5462bea2.png"},368:function(s,a,t){s.exports=t.p+"assets/img/image-20230712110759136.34d9b088.png"},369:function(s,a,t){s.exports=t.p+"assets/img/image-20230712155441048.9d96fd34.png"},370:function(s,a,t){s.exports=t.p+"assets/img/image-20230719183549812.6360888c.png"},371:function(s,a,t){s.exports=t.p+"assets/img/image-20230712171019805.d604121b.png"},372:function(s,a,t){s.exports=t.p+"assets/img/image-20230719185550777.4a9cf65f.png"},441:function(s,a,t){"use strict";t.r(a);var e=t(4),v=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"web-性能权威指南"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#web-性能权威指南"}},[s._v("#")]),s._v(" web 性能权威指南")]),s._v(" "),a("h2",{attrs:{id:"第一部分-网络技术概览"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#第一部分-网络技术概览"}},[s._v("#")]),s._v(" 第一部分 网络技术概览")]),s._v(" "),a("blockquote",[a("p",[s._v("描述时延的组成以及带宽的概念、TCP、UDP、TLS……")])]),s._v(" "),a("h3",{attrs:{id:"延迟-带宽"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#延迟-带宽"}},[s._v("#")]),s._v(" 延迟&带宽")]),s._v(" "),a("p",[s._v("时延指的是消息从发送方转移到接收方总共需要的时间，具体时延可由 4 部分组成")]),s._v(" "),a("ul",[a("li",[s._v("传播延迟：消息传播时间，受"),a("code",[s._v("传播距离")]),s._v("和"),a("code",[s._v("传播介质")]),s._v("影响")]),s._v(" "),a("li",[s._v("传输延迟：把消息中所有比特转移到链路所需要的时间，受"),a("code",[s._v("链路速度")]),s._v("和"),a("code",[s._v("信息长度")]),s._v("影响")]),s._v(" "),a("li",[s._v("处理延迟：处理分组首部、检查位错误及确定分组目标所需的时间")]),s._v(" "),a("li",[s._v("排队延迟：分组排队等待处理的时间")])]),s._v(" "),a("p",[a("code",[s._v("CDN（内容分发网络）")]),s._v("：将资源从离用户最近的服务器分发给用户从而降低传播距离")]),s._v(" "),a("p",[a("code",[s._v("traceroute")]),s._v("：一个网络诊断工具，可列出分组经过的路由节点以及它在 IP 网络中每一跳的延迟")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("traceroute")]),s._v("\n$ tranceroute google.com "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看访问google需要经过的路由")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[s._v("第一章总结的来说：介绍了时延的概念，包括定义、组成部分以及部分优化手段，带宽大并不意味着传输就快，往往受 "),a("code",[s._v("ISP")]),s._v(" 部署方式等外界因素的影响。")]),s._v(" "),a("h3",{attrs:{id:"tcp"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tcp"}},[s._v("#")]),s._v(" TCP")]),s._v(" "),a("p",[s._v("关键句：大多数情况下，TCP 的瓶颈都是延迟，而非带宽")]),s._v(" "),a("ul",[a("li",[a("p",[a("code",[s._v("ip")]),s._v("：负责联网主机之间的路由选择和寻址")])]),s._v(" "),a("li",[a("p",[a("code",[s._v("tcp")]),s._v("：负责在不可靠的传输信道之上提供可靠的抽象层")])]),s._v(" "),a("li",[a("p",[a("code",[s._v("TFO")]),s._v("：TCP 快速打开机制，减少新建 TCP 连接带来的性能损失")])])]),s._v(" "),a("p",[s._v("拥塞预防及控制")]),s._v(" "),a("blockquote",[a("p",[s._v("包括流量控制、慢启动、拥塞预防")])]),s._v(" "),a("ul",[a("li",[s._v("流量控制：接收方和发送方各自维护一个最大接收窗口"),a("code",[s._v("rwnd")]),s._v("，在信息过载或者无法处理的时候通过缩放自己的接收窗口来限制发送方推送更多分组")]),s._v(" "),a("li",[s._v("慢启动：在 TCP 建立初期，双方都无法知晓对方的带宽上限，需要一个算法来窥探。而慢启动的引入就是通过每次 "),a("code",[s._v("倍增")]),s._v(" "),a("code",[s._v("cwnd")]),s._v("（拥塞窗口）推送等大数据的方式来逼近最大界限。")])]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(363)}}),s._v(" "),a("p",[s._v("实际在网络中传输的分组大小小于 "),a("code",[s._v("min(rwnd, cwnd)")]),s._v("，因此无论 "),a("code",[s._v("lsnp")]),s._v(" 所谓的带宽有多大，实际影响传输速度的还是窗口大小")]),s._v(" "),a("p",[s._v("队首阻塞")]),s._v(" "),a("blockquote",[a("p",[s._v("因为 TCP 可靠传输机制，所有分组必须按序到达，如若前面分组丢失则后面分组必须保存在 "),a("code",[s._v("接收端")]),s._v(" TCP 缓冲区等待分组重发完成后再组合（传输层）；等待分组完成组合完毕才能访问数据（应用层）")])]),s._v(" "),a("p",[s._v("这是 TCP 无法避免的机制，因此对于一些场景比如语言、游戏 3D 来说，丢包是可以接受的，否则产生的“抖动”会降低用户体验。")]),s._v(" "),a("p",[s._v("服务器配置调优")]),s._v(" "),a("blockquote",[a("p",[s._v("通过更新内核加上配置服务器选项来优化 TCP 连接")])]),s._v(" "),a("ul",[a("li",[s._v("增大初始 TCP 拥塞窗口")]),s._v(" "),a("li",[s._v("关闭满启动重启 —— 取消在连接空闲一定时间后重置连接的拥塞窗口")]),s._v(" "),a("li",[s._v("窗口缩放 —— 增大接受窗口")]),s._v(" "),a("li",[s._v("TCP 快速打开 —— 减少新建 TCP 连接带来的性能损失")])]),s._v(" "),a("h3",{attrs:{id:"udp"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#udp"}},[s._v("#")]),s._v(" UDP")]),s._v(" "),a("blockquote",[a("p",[s._v("UDP 中传输的数据一般叫数据报而不是分组 why？分组可以用来指代任何格式化的数据块，而数据报则通常只用来描述那\n些通过不可靠的服务传输的分组，既不保证送达，也不发送失败通知")])]),s._v(" "),a("p",[s._v("UDP 的首部仅仅包含少量信息，通过简单封装 IP 分组，UDP 仅仅是在 IP 层之上通过嵌入应用程序的源端口和目标端口，提供了一个“应用程序多路复用”机制")]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(364)}}),s._v(" "),a("ul",[a("li",[s._v("不保证消息交付")]),s._v(" "),a("li",[s._v("不保证交付顺序")]),s._v(" "),a("li",[s._v("不跟踪连接状态")]),s._v(" "),a("li",[s._v("不需要拥塞控制")])]),s._v(" "),a("h4",{attrs:{id:"nat-穿透"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nat-穿透"}},[s._v("#")]),s._v(" NAT 穿透")]),s._v(" "),a("blockquote",[a("p",[s._v("NAT 穿透的引出是为了解决 IPV4 地址不够用，即维护一个映射表来完成内部网络到外部网络数据访问 "),a("a",{attrs:{href:"https://arthurchiao.art/blog/how-nat-traversal-works-zh/#11-%E8%83%8C%E6%99%AFipv4-%E5%9C%B0%E5%9D%80%E7%9F%AD%E7%BC%BA%E5%BC%95%E5%85%A5-nat",target:"_blank",rel:"noopener noreferrer"}},[s._v("detail"),a("OutboundLink")],1)])]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(365)}}),s._v(" "),a("p",[s._v("通常有三个网段作为保留网段提供给 NAT 内网使用，不作为外网 IP")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("10.0.0.0~10.255.255.255")])]),s._v(" "),a("li",[a("code",[s._v("172.16.0.0~172.31.255.255")])]),s._v(" "),a("li",[a("code",[s._v("192.168.0.0~192.168.255.255")])])]),s._v(" "),a("p",[s._v("好处就在与不同网段都可以复用这三个网络，只需要维护一个 NAT 映射表即可。")]),s._v(" "),a("p",[s._v("🔐 为什么 NAT 穿透一般使用的是 "),a("code",[s._v("UDP")])]),s._v(" "),a("p",[s._v("TCP 需要三次握手建立连接，内部主机与 NAT 设备建立连接以后这个通信信道就一直处于等待中，NAT 设备就无法与其他公网主机建立连接进行数据交换了。UDP 无状态无连接，因此只需 NAT 设备周期性维护一个 NAT 映射表即可，不占用通信信道。")]),s._v(" "),a("p",[s._v("🔐 内网穿透的具体实现 "),a("code",[s._v("参考")])]),s._v(" "),a("p",[s._v("NAT 穿透相当于是基于内部主机通过端口转发实现访问外部网络的能力，但对于外部网络访问内部网络无能为力，可基于公网服务器和 "),a("code",[s._v("frp")]),s._v(" 实现外网访问连接内网。"),a("code",[s._v("frp")]),s._v(" 主要分为服务端和客户端，服务端主要是公网服务器配置一个监控，而客户端则是内网服务器。对于服务端主要配置 "),a("code",[s._v("frps.ini")]),s._v(" ，对于客户端主要配置 "),a("code",[s._v("fprc.ini")])]),s._v(" "),a("ul",[a("li",[a("p",[s._v("服务端")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("下载 "),a("code",[s._v("frp")])]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://github.com/fatedier/frp/releases/download/v0.33.0/frp_0.33.0_linux_amd64.tar.gz\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("配置 "),a("code",[s._v("frps.ini")])]),s._v(" "),a("div",{staticClass:"language-ini line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-ini"}},[a("code",[a("span",{pre:!0,attrs:{class:"token section"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token section-name selector"}},[s._v("common")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")])]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# frp监听的端口，默认是7000，可以改成其他的")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("bind_port")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("7000")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 授权码 用于 c/s 校验")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("token")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("jintao1990")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# frp管理后台端口，请按自己需求更改")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("dashboard_port")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("7500")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# frp管理后台用户名和密码，请改成自己的")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("dashboard_user")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("admin")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("dashboard_pwd")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("admin")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("enable_prometheus")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("true")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# frp日志配置")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("log_file")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("/var/log/frps.log")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("log_level")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("info")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("log_max_days")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("3")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("设置和启动 "),a("code",[s._v("frp")]),s._v(" 服务。这里使用 "),a("code",[s._v("systemctl")]),s._v(" 启动的原因主要是在 "),a("code",[s._v("frp")]),s._v(" 文件夹执行 "),a("code",[s._v("./frps")]),s._v(" 的时候不会以 "),a("code",[s._v("frps.ini")]),s._v(" 作为配置文件启动，而执行以下 "),a("code",[s._v("bash")]),s._v(" 将更有效地管理 "),a("code",[s._v("frp")]),s._v(" 的执行周期。")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-p")]),s._v(" /etc/frp "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" frps.ini /etc/frp "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" frps /usr/bin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" systemd/frps.service /usr/lib/systemd/system/ "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v("\n    systemctl "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" frps "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v("\n    systemctl start frps\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("如果服务器存在防火墙的话，需要开启 "),a("code",[s._v("7000")]),s._v(" 和 "),a("code",[s._v("7500")]),s._v(" 端口")])])])]),s._v(" "),a("li",[a("p",[s._v("客户端")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("允許被 "),a("code",[s._v("ssh")]),s._v(" 訪問，"),a("code",[s._v("ubuntu")]),s._v(" 可以通過安裝 "),a("code",[s._v("openssh-server")])]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v("  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" openssh-server\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("下载 "),a("code",[s._v("frp")]),s._v(" 同上")])]),s._v(" "),a("li",[a("p",[s._v("配置 "),a("code",[s._v("frpc.ini")])]),s._v(" "),a("div",{staticClass:"language-ini line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-ini"}},[a("code",[a("span",{pre:!0,attrs:{class:"token section"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token section-name selector"}},[s._v("common")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")])]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("server_addr")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("120.77.245.193")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("server_port")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("7000")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 与 fprs.ini 配置必须一样")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("token")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("jintao1990")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token section"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token section-name selector"}},[s._v("ssh")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")])]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("type")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("tcp")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 当前在网络中的 ip 地址")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("local_ip")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("192.168.3.14")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("local_port")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("22")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token key attr-name"}},[s._v("remote_port")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token value attr-value"}},[s._v("6000")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br")])]),a("p",[s._v("6000 端口需要服务器开启")])]),s._v(" "),a("li",[a("p",[a("code",[s._v("启动")]),s._v(" ，当然可以同上使用 "),a("code",[s._v("systemctl")]),s._v(" 管理 "),a("code",[s._v("frp")])]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ ./frpc "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-c")]),s._v(" frpc.ini\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])])])]),s._v(" "),a("li",[a("p",[s._v("连接")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ssh")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-p")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("6000")]),s._v(" jzy@120.77.245.193\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("ul",[a("li",[s._v("6000 为 "),a("code",[s._v("frpc.ini")]),s._v(" 配置的 "),a("code",[s._v("remote_port")])]),s._v(" "),a("li",[s._v("jzy 为当前内网主机的其中一个用户名")]),s._v(" "),a("li",[s._v("120.77.245.193 为服务器 "),a("code",[s._v("ip")])])])])]),s._v(" "),a("h3",{attrs:{id:"tsl"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tsl"}},[s._v("#")]),s._v(" TSL")]),s._v(" "),a("blockquote",[a("p",[s._v("TSL 是在传输层上建立的一套安全通信机制")])]),s._v(" "),a("p",[s._v("TSL 通常需要经历四次握手完成 TLS 版本、加密套件等的确认再进行数据传输")]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(366)}}),s._v(" "),a("ul",[a("li",[s._v("0 ms：TLS 在可靠的传输层（TCP）之上运行，这意味着首先必须完成 TCP 的“三次握手”，即一次完整的往返。")]),s._v(" "),a("li",[s._v("56 ms：TCP 连接建立之后，客户端再以纯文本形式发送一些规格说明，比如它所运行的 TLS 协议的版本、它所支持的加密套件列表，以及它支持或希望使用的另外一些 TLS 选项。")]),s._v(" "),a("li",[s._v("84 ms：服务器取得 TLS 协议版本以备将来通信使用，从客户端提供的加密套件列表中选择一个，再附上自己的证书，将响应发送回客户端。作为可选项，服务器也可以发送一个请求，要求客户端提供证书以及其他 TLS 扩展参数。")]),s._v(" "),a("li",[s._v("112 ms：假设两端经过协商确定了共同的版本和加密套件，客户端把自己的证书提供给了服务器。然后，客户端会生成一个新的对称密钥，用服务器的公钥来加密，加密后发送给服务器，告诉服务器可以开始加密通信了。到目前为止，除了用服务器公钥加密的新对称密钥之外，所有数据都以明文形式发送。")]),s._v(" "),a("li",[s._v("140 ms：最后，服务器解密出客户端发来的对称密钥，通过验证消息的 MAC 检测消息完整性，再返回给客户端一个加密的“Finished”消息。")]),s._v(" "),a("li",[s._v("168 ms：客户端用它之前生成的对称密钥解密这条消息，验证 MAC，如果一切顺利，则建立信道并开始发送应用数据。")])]),s._v(" "),a("h2",{attrs:{id:"第二部分-无线网络"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#第二部分-无线网络"}},[s._v("#")]),s._v(" 第二部分 无线网络")]),s._v(" "),a("blockquote",[a("p",[s._v("无线网络值不需要通过线缆连接的网络")])]),s._v(" "),a("p",[s._v("无线网络包括以下类型：")]),s._v(" "),a("ul",[a("li",[s._v("个人局域网（PAN）：应用于 "),a("code",[s._v("个人活动范围内")]),s._v(" 蓝牙、NFC")]),s._v(" "),a("li",[s._v("局域网（LAN）：应用于 "),a("code",[s._v("一栋楼或校园内")]),s._v(" WIFE")]),s._v(" "),a("li",[s._v("城域网（MAN）：城市内的 WiMax")]),s._v(" "),a("li",[s._v("广域网（WAN）：世界范围内网络")])]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(367)}}),s._v(" "),a("ul",[a("li",[s._v("C 是信道容量，单位是 bit/s；")]),s._v(" "),a("li",[s._v("BW 是可用带宽，单位是 Hz；")]),s._v(" "),a("li",[s._v("S 是信号，N 是噪声，单位是 W。")])]),s._v(" "),a("p",[s._v("以上是香农公式 —— 描述了无线网络信道容量受带宽和信噪比的影响")]),s._v(" "),a("h3",{attrs:{id:"wife"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#wife"}},[s._v("#")]),s._v(" Wife")]),s._v(" "),a("blockquote",[a("p",[s._v("无线局域网")])]),s._v(" "),a("p",[s._v("目前路由器提供了两个频道信号")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("5 GHZ")])]),s._v(" "),a("li",[a("p",[s._v("2.4 GHZ")]),s._v(" "),a("p",[s._v("2.4 GHZ 频段被应用于很多电子设备，只有三个信号通道，在多设备连接时容易出现信道拥堵。而 5GHZ 的频段相对较高，即可连接的设备减少同时有 22 个信道，阻塞拥堵得到极大缓解")])])]),s._v(" "),a("p",[s._v("Wife 冲突避免机制："),a("code",[s._v("CSMA/CA")]),s._v("机制 —— 在认为信道空闲时发送数据来避免冲突")]),s._v(" "),a("h2",{attrs:{id:"第三章-http"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#第三章-http"}},[s._v("#")]),s._v(" 第三章 HTTP")]),s._v(" "),a("blockquote",[a("p",[s._v("HTTP 版本的发展历史：0.9 -> 1.0 -> 1.1 -> 2.0；web 应用性能瓶颈和衡量手段；web 应用性能优化手段")])]),s._v(" "),a("p",[s._v("web 应用性能衡量理论来说可以通过人为模拟来测试，但这种方式往往受到计算机内存、浏览器版本、缓存等众多因素影响导致没有一个统一的标准。因此 "),a("code",[s._v("W3C")]),s._v(" 引出了 "),a("code",[s._v("Navigation Timing API")]),s._v(" ，如下")]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(368)}}),s._v(" "),a("p",[s._v("目前浏览器优化机制从核心策略来说，可分为两类：")]),s._v(" "),a("ul",[a("li",[s._v("基于文档的优化（资源预获取、提前解析）")]),s._v(" "),a("li",[s._v("推测优化（DNS 预解析、TCP 预连接、页面预渲染）\n"),a("ul",[a("li",[s._v("DNS 预解析：浏览器对可能的域名（通过学习导航历史等行为）进行提前解析")]),s._v(" "),a("li",[s._v("TCP 预连接：DNS 完成后根据猜测行为进行 TCP 连接减少 TTR")]),s._v(" "),a("li",[s._v("页面预渲染：猜测用户可能会导航到的页面提前渲染，后面只需简单作切换操作即可")])])])]),s._v(" "),a("p",[s._v("针对网络优化，消除和减少不必要的网络延迟 和 把传输的字节数降到最少是优化核心")]),s._v(" "),a("ul",[a("li",[s._v("减少 DNS 查询")]),s._v(" "),a("li",[s._v("减少 HTTP 请求")]),s._v(" "),a("li",[s._v("使用 CDN")]),s._v(" "),a("li",[s._v("配置浏览器缓存")]),s._v(" "),a("li",[s._v("Gzip 资源")]),s._v(" "),a("li",[s._v("避免 HTTP 重定向")])]),s._v(" "),a("h3",{attrs:{id:"http1-0"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http1-0"}},[s._v("#")]),s._v(" HTTP1.0")]),s._v(" "),a("h4",{attrs:{id:"http-管道"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http-管道"}},[s._v("#")]),s._v(" HTTP 管道")]),s._v(" "),a("p",[s._v("🔐 HTTP 管道、队首阻塞（应用层）")]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(369)}}),s._v(" "),a("p",[s._v("上图描述的主要是在管道机制的基础上服务器并行处理请求是否可以继续减少延迟")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("HTTP管道")]),s._v(" ：客户端推送请求队列，服务器端按 FIFO 处理队列")])]),s._v(" "),a("p",[s._v("答案是不能，因为 HTTP1.1 中服务器在一个 TCP 连接内只能串行返回响应，即使队列后的请求处理完成也必须缓存起来等待前面请求处理完成且响应才能继续。")]),s._v(" "),a("h4",{attrs:{id:"连接与拼合"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#连接与拼合"}},[s._v("#")]),s._v(" 连接与拼合")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("连接指的是将多个 Javascript 或 CSS 文件组合为一个文件")])]),s._v(" "),a("li",[a("p",[s._v("拼合值把多张图片组合成一个更大的符合图片")])])]),s._v(" "),a("p",[s._v("是否使用连接与拼合需要考虑以下问题")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("连接后文件体积增大， CSSOM 会阻塞渲染，JS 会阻塞解析")])]),s._v(" "),a("li",[a("p",[s._v("缓存体积增大，微小改变导致缓存更新需重新下载资源")])]),s._v(" "),a("li",[a("p",[s._v("资源包中可能包含当前页面不需要的内容（对于拼合来说，一张大的图片可能每次使用的就是其中的一小块，但浏览器还是会分析整个图片，带来内存开销）")])])]),s._v(" "),a("h3",{attrs:{id:"http2-0"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http2-0"}},[s._v("#")]),s._v(" HTTP2.0")]),s._v(" "),a("blockquote",[a("p",[s._v("HTTP2.0 在 HTTP1.X 的基础上新增一些处理机制来提升性能，包括二进制分帧层、流量控制、头部压缩、资源优先级、服务器推送")])]),s._v(" "),a("p",[s._v("要理解 HTTP2.0 的核心，首先得理解几个新的概念：流、消息、帧")]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(370)}}),s._v(" "),a("ul",[a("li",[s._v("流：已经建立的连接上的双向字节流")]),s._v(" "),a("li",[s._v("消息：与逻辑消息对应的完整的一系列数据帧")]),s._v(" "),a("li",[s._v("帧：HTTP2.0 的最小通信单位")])]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(371)}}),s._v(" "),a("p",[s._v("区别于 HTTP1.X 版本以纯文本形式编码数据，通过换行分隔；HTTP2.0 将数据分隔封装成帧，并采用二进制格式编码")]),s._v(" "),a("h2",{attrs:{id:"第四章-浏览器-api-与协议"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#第四章-浏览器-api-与协议"}},[s._v("#")]),s._v(" 第四章 浏览器 API 与协议")]),s._v(" "),a("blockquote",[a("p",[s._v("XMLHttpRequest、SSE（服务器推送协议）、WebSocket、WebRtc")])]),s._v(" "),a("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:t(372)}}),s._v(" "),a("h3",{attrs:{id:"websocket"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#websocket"}},[s._v("#")]),s._v(" WebSocket")]),s._v(" "),a("p",[a("code",[s._v("WebSocket")]),s._v(" 是全双工通信协议，可以实现客户端与服务器双向、基于消息的文本或二进制进行通信")]),s._v(" "),a("p",[s._v("基于二进制分帧进行数据传输，一个消息可以分为若干的帧进行传递。")]),s._v(" "),a("p",[s._v("🔐 多路复用 & 队首阻塞")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("WebSocker")]),s._v(" 并不存在多路复用机制，这也就意味这每次的连接都需要额外的 TCP 连接")]),s._v(" "),a("li",[a("code",[s._v("WebSocker")]),s._v(" 存在队首阻塞，因为没有 HTTP2.0 中流标识的概念，帧只能在一个消息内部乱序发送，存在一个大消息的话那么后面消息的传递就只能等待")])])])}),[],!1,null,null,null);a.default=v.exports}}]);