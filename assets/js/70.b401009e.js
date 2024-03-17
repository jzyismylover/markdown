(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{433:function(t,s,a){"use strict";a.r(s);var n=a(4),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"学习内容"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#学习内容"}},[t._v("#")]),t._v(" 学习内容")]),t._v(" "),s("h2",{attrs:{id:"快应用卡片开发"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#快应用卡片开发"}},[t._v("#")]),t._v(" 快应用卡片开发")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("学习资料")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://doc.quickapp.cn/tutorial/framework/theme-mode.html#forcedark-%E5%BC%80%E5%85%B3",target:"_blank",rel:"noopener noreferrer"}},[t._v("快应用开发文档"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://open.oppomobile.com/new/developmentDoc/info?id=11803",target:"_blank",rel:"noopener noreferrer"}},[t._v("快应用卡片开发文档"),s("OutboundLink")],1)])])]),t._v(" "),s("h2",{attrs:{id:"任务系统二期"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#任务系统二期"}},[t._v("#")]),t._v(" 任务系统二期")]),t._v(" "),s("p",[t._v("从交互来看其实难度不算特别大，但其实开发过程还是遇到了不少问题导致比预期的开发时间要长")]),t._v(" "),s("ul",[s("li",[t._v("组件数据流在初期没定义好")]),t._v(" "),s("li",[t._v("一期部分组件没封装好，二期功能叠加耗时耗力")]),t._v(" "),s("li",[t._v("ui 开发逻辑没有考虑数据回填")])]),t._v(" "),s("h3",{attrs:{id:"组件数据流"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#组件数据流"}},[t._v("#")]),t._v(" 组件数据流")]),t._v(" "),s("p",[t._v("其实这应该在初期就应该要定义好，比如作为子组件需要的数据是需要父组件传入还是通过某些关键数据在生命周期内发起请求。")]),t._v(" "),s("ul",[s("li",[t._v("从父组件传入：考虑一个问题 —— 数据延迟性。因为其实父组件的数据获取在大部分场景下也是通过网络请求的方式，那就意味着在子组件挂载过程引用父组件传入的值可能为空，需要进行判断。而在大部分场景下，"),s("code",[t._v("watch")]),t._v(" 可以解决这个问题。在 "),s("code",[t._v("watch")]),t._v(" 中定义监听，由空到非空的过程必然会触发 "),s("code",[t._v("handler")]),t._v(" 函数，因此可以在 "),s("code",[t._v("handler")]),t._v(" 中再对一些依赖数据进行初始化")])]),t._v(" "),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),s("p",[t._v("需要注意的是，依赖数据本身需要做一个兼容设置，否则在第一次页面渲染的过程会导致非预期报错")])]),t._v(" "),s("h3",{attrs:{id:"组件封装"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#组件封装"}},[t._v("#")]),t._v(" 组件封装")]),t._v(" "),s("p",[t._v("在业务中有一个需求是能够同时对表单编辑和查看详情，支持三种状态（查看、新建、更新）。为了解决不必要代码冗余，一期使用了 "),s("code",[t._v("render")]),t._v(" 函数的方式，通过 js 配置表单，并在 "),s("code",[t._v("render")]),t._v(" 函数根据不同条件渲染。回看这个设计思路，其实本身没有什么问题，但实际从代码上看，在 "),s("code",[t._v("methods")]),t._v(" 里面有很多 "),s("code",[t._v("renderMethods")]),t._v(" —— 渲染 ui，导致在看代码的时候非常混乱，很难快速定位或者说理解自己当时的意图。")]),t._v(" "),s("blockquote",[s("p",[t._v("为什么用 render 函数？")])]),t._v(" "),s("p",[t._v("对于这类需要大量使用表单控件的场景，其实会定义好若干 "),s("code",[t._v("form-item")])]),t._v(" "),s("ul",[s("li",[s("code",[t._v("SelectFormItem")])]),t._v(" "),s("li",[s("code",[t._v("InputFormItem")])]),t._v(" "),s("li",[s("code",[t._v("RadioFormItem")])]),t._v(" "),s("li",[t._v("……")])]),t._v(" "),s("p",[t._v("在配置项中是这么去定义若干个表单控件集合")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" formItems "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("form_type")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'select'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("form_type")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'input'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("form_type")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'textarea'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("form_type")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'radio'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("form_type")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'checkbox'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 自定义 form_type")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br")])]),s("p",[s("code",[t._v("render")]),t._v(" 函数可以通过变量去渲染组件")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("render")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("h")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("h")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'form'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    formItems"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("map")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("formItem")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("h")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("formItem"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("form_type"),s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("-form-item")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("props")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br")])]),s("p",[t._v("那么像上面这种写法就非常方便了，需要叠加就往 "),s("code",[t._v("formItems")]),t._v(" 里面叠加就好。但是要兼容详情 & 更新的状态就得根据条件判断生成，这样子就会导致代码段整体非常混乱没有逻辑。")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("提示")]),t._v(" "),s("p",[t._v("因为二期需要叠加新的自定义表单控件，所以理解原来这个过程各种 ui render 函数就非常繁琐。")])]),t._v(" "),s("p",[t._v("解决思路的话还是需要将不同状态进行分类，如果是"),s("code",[t._v("更新")]),t._v("或者"),s("code",[t._v("创建")]),t._v("状态的话单独一个组件，"),s("code",[t._v("详情")]),t._v("单独一个组件，这样子两者互不干涉可以定义自己的表单。")]),t._v(" "),s("h3",{attrs:{id:"组件数据回填"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#组件数据回填"}},[t._v("#")]),t._v(" 组件数据回填")]),t._v(" "),s("p",[t._v("一些提交类在提交完成，下次打开后是需要进行数据回填的。但在 UI 开发阶段其实很多时候并没有考虑这个问题，因为数据本身很多都是在 data 中通过静态数据定义好，而实际后端数据的结构并不一定和我们相似（在后端没给出具体数据定义的情况下），这就导致在处理接口的时候和之前写的逻辑存在互斥的情况。")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("统一逻辑 & 数据结构是个比较大成本的工作")])]),t._v(" "),s("p",[t._v("因此在像这种下一步需要进行数据回填的操作的情况下在 UI 开发阶段首先就需要和后端对齐数据结构，然后自己 mock 一个延时数据函数模拟真正场景下，这样才可能将问题即时暴露。")]),t._v(" "),s("h2",{attrs:{id:"前端-cli-工具搭建"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前端-cli-工具搭建"}},[t._v("#")]),t._v(" 前端 cli 工具搭建")])])}),[],!1,null,null,null);s.default=e.exports}}]);