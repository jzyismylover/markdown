(window.webpackJsonp=window.webpackJsonp||[]).push([[74],{438:function(s,t,a){"use strict";a.r(t);var n=a(4),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"大数据与双边关系量化研究"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#大数据与双边关系量化研究"}},[s._v("#")]),s._v(" 大数据与双边关系量化研究")]),s._v(" "),t("h2",{attrs:{id:"相关研究"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#相关研究"}},[s._v("#")]),s._v(" 相关研究")]),s._v(" "),t("p",[s._v("​ 要利用大数据分析国家之间友好关系，首先得解决数据的来源。鉴于自行爬取数据困难且分类困难，网上部分的做法是直接使用 "),t("code",[s._v("GDElT")]),s._v(" 提供的数据集来进行分析（数据比较老）。")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://www.kaggle.com/datasets/gdelt/gdelt/data",target:"_blank",rel:"noopener noreferrer"}},[t("code",[s._v("GDELT")]),s._v(" 数据集"),t("OutboundLink")],1),s._v(" "),t("code",[s._v("GDELT")]),s._v(" 监控并记录世界上几乎每一个角落的门户网站、印刷媒体、电视、广播、网络媒体、网络论坛，并识别人物、地点、组织、主题、情绪、次数、图像和事件。简单地说，"),t("code",[s._v("GDELT")]),s._v("是一个通过世界媒体的眼睛看人类社会的实时开放的数据全球库，实时地深入到世界上最偏远角落的事件、反应和情感，并使所有这一切成为一个开放的数据的流，使研究人类社会成为可能。")]),s._v(" "),t("blockquote",[t("p",[s._v("相关参考论文")])]),s._v(" "),t("p",[t("a",{attrs:{href:"http://qjip.tsinghuajournals.com/article/2019/2096-1545/101393D-2019-2-104.shtml",target:"_blank",rel:"noopener noreferrer"}},[s._v("以 GDELT 与中美关系为例展开量化研究"),t("OutboundLink")],1)]),s._v(" "),t("p",[t("a",{attrs:{href:"http://geoscien.neigae.ac.cn/article/2019/1560-8999/1560-8999-21-1-14.shtml",target:"_blank",rel:"noopener noreferrer"}},[s._v("GDELT 数据网络化挖掘与国际关系分析"),t("OutboundLink")],1)]),s._v(" "),t("p",[s._v("​ 不过如果实验室已经解决了数据的问题，那么下一步应该就是如何根据一个新闻判断两个国家之前的友好程度，这个感觉是情感分析模块，实验室应该有相关的处理工作做过，我不太熟悉这个领域想帮也不太帮的上了。")]),s._v(" "),t("h2",{attrs:{id:"世界地图实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#世界地图实现"}},[s._v("#")]),s._v(" 世界地图实现")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://img.hcharts.cn/mapdata/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Highmaps 地图映射"),t("OutboundLink")],1),s._v("：里面包括了全球很多地方地理位置 "),t("code",[s._v("json")]),s._v(" 文件，可根据实际需要下载对应的 "),t("code",[s._v("json")]),s._v(" ，然后自行映射对应的中文")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://echarts.apache.org/examples/data/asset/",target:"_blank",rel:"noopener noreferrer"}},[s._v("echarts 地图数据获取链接"),t("OutboundLink")],1),s._v("："),t("code",[s._v("echarts")]),s._v(" 官网提供的地图 "),t("code",[s._v("json")]),s._v(" 文件")]),s._v(" "),t("blockquote",[t("p",[t("code",[s._v("vue3-worldarea-echarts")]),s._v(" https://gitee.com/jzyislover/vue3-worldwide-echarts")])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[s._v("├─App"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("vue\n├─main"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n├─style"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("css\n├─vite"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("env"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("d"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n├─utils\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   ├─index"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   ├─lib\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  └echarts"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// echarts 对象初始化配置")]),s._v("\n├─json\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  ├─geo\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    ├─"),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("HK")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 香港地图地理位置信息")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    ├─world"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("continents"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 七个大洲地理位置信息")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    ├─world"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("country"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 全球国家地理位置信息")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    └index"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  ├─mapping\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    ├─continents"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("zh"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("mapping"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 州中文映射")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    ├─country"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("name"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("zh"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("mapping"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 国家中文映射")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("    └index"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  ├─continents\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─africa"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 非洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─asia"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 亚洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─europe"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 欧洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─index"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─north"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("america"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 北美洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─oceania"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json       "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 大洋洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     └south"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("america"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("geo"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 南美洲地图")]),s._v("\n├─hooks\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   ├─useEcharts"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// hooks 里面只需关注这个文件就好")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   ├─useEventListener"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("   └useTimeout"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ts\n├─components\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─HongkongChart"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("vue "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 香港地图组件(参考)")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     ├─WorldCountryChart"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("vue "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 世界大洲地图")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("     └WorldwideChart"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("vue "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 世界地图组件")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br")])]),t("p",[s._v("代码里面最主要的是三个文件："),t("code",[s._v("useEcharts")]),s._v("、"),t("code",[s._v("WorldWideEchart")]),s._v("、"),t("code",[s._v("HongkongChart")])]),s._v(" "),t("ul",[t("li",[t("code",[s._v("useEcharts")]),s._v("：提供一个使用 "),t("code",[s._v("echarts")]),s._v(" 的 "),t("code",[s._v("hooks")]),s._v("，非常方便在 "),t("code",[s._v("vue")]),s._v(" 文件实例化"),t("code",[s._v("echarts")])]),s._v(" "),t("li",[t("code",[s._v("WorldWideChart")]),s._v("：世界地图 "),t("code",[s._v("demo")]),s._v("，支持世界地图二级级联（查看具体每个州对应的国家）")]),s._v(" "),t("li",[t("code",[s._v("WorldCountryChart")]),s._v("：同样是世界地图 "),t("code",[s._v("demo")]),s._v("，但是是在第一层就展示所有国家的数据")]),s._v(" "),t("li",[t("code",[s._v("HongKongChart")]),s._v("：一个使用 "),t("code",[s._v("useEcharts")]),s._v(" 的示例文件，同时也是地图选项配置的参考")])]),s._v(" "),t("blockquote",[t("p",[s._v("🌘 有些地方需要注意下")])]),s._v(" "),t("ol",[t("li",[t("p",[s._v("因为我们在世界地图上定义了 "),t("code",[s._v("nameMap")]),s._v("，"),t("code",[s._v("nameMap")]),s._v(" 的作用是：将地图上显示的英文中文化（如果不需要这个功能的化可以不定义 "),t("code",[s._v("nameMap")]),s._v("）。"),t("code",[s._v("series[0].data")]),s._v(" 本身是需要一个数组")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("name")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"China"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("value")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("name")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UK"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("value")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("20")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br")])]),t("p",[s._v("但是配置了 "),t("code",[s._v("nameMap")]),s._v(" 的话上面的 "),t("code",[s._v("name")]),s._v(" 就得变成是中文传入，具体可参考 "),t("code",[s._v("HongKongChart.vue")]),s._v("，因此如果后端返回的数据是英文的话需要再做一层英文到中文的映射")]),s._v(" "),t("img",{staticStyle:{display:"block",margin:"auto"},attrs:{src:"/home/jzy/.config/Typora/typora-user-images/image-20231016232250860.png"}})])]),s._v(" "),t("h2",{attrs:{id:"总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[s._v("#")]),s._v(" 总结")]),s._v(" "),t("p",[s._v("算法那块不太熟悉帮不了太多忙，前端这边的话像一些轮子什么的可以告诉我大概需求我可以开发一些基础 demo，有啥需要就找我能帮的一定帮。然后，逸玲 “对力不能及之事处之泰然，对力所能及之事全力以赴”，很多东西我们不可控，把该做的复习工作做好就可以了! 今天农历 9.13 喔，生日快乐 😄 ，祝逸玲身体建健康康（复习之余也要注意保护眼睛），学业进步（论文顺顺利利），心想事成（成功上岸）！！！（天气准备变凉快了，注意保暖）")])])}),[],!1,null,null,null);t.default=e.exports}}]);