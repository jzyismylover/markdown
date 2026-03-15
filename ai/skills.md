# Agent Skill



## 一、背景

Agent Skills 原来是 Anthropic 为了提升 claude 在特定任务（文档生成、数据统计……）执行效率提出，但是后边越来越多工具也都支持了这项技术，于是在 2025.12.18 Anthropic 将其发布为了开放标准。那为什么这个技术会这么火呢，对应了当前 AI 应用里边哪些问题？目前 AI 通过 MCP 被赋予了各式各样的能力，但在某些场景下 AI 会不知道使用什么工具来解决问题，导致在遇到问题的时候像 “无头苍蝇” 一样地去尝试调用不同工具，调用过程中会把相关工具的 schem、descrption 等等信息一起带给模型，在不断的尝试过程中上下文 token 也累积越来越多，在目前一个token一粒米的大环境下导致很快就把我们账号的额度消耗完。而 Agent Skills 有个非常高级的概念 “**渐进式披露**”，这个概念通俗来讲就是支持内容的按需加载，从概念上看上能解决 token 爆炸的问题，那到底是不是这样子的呢？下文会详细讲解其技术架构以及工作原来。



## 二、核心架构

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](https://docs-1306887959.cos.ap-guangzhou.myqcloud.com/markdown/agent-skills-architecture.png)

从 Claude Agent 架构来看，Agent 是包含了几个核心要素：system prompt、equipped skills、mcp server，而 equipped skills 仅仅包含 skill 的名称，skill 相关具体的资源是存放在物理机上。为了更好地理解上边的架构，下边以官方提供 skill 的工作流程图来窥探在 skill 加持下 agent 的工作流程



![Skills loading into context window - showing the progressive loading of skill metadata and content](https://docs-1306887959.cos.ap-guangzhou.myqcloud.com/markdown/agent-skills-context-window.png)

从流程上可以看到初始的上下文只包含了 prompt 以及 skill 的元数据（名字、描述），在用户输入 query 后 Claude 会根据 query 的内容匹配应该使用哪一个 skill，在确定使用的 skill 后发送读取指令给到 Agent Client 通过 shell 读取 skill 的具体内容。skill 内容加载到上下后根据里边的描述发现仍需加载另外一份 forms.md 文档作为知识参考，因此重复前边 skill 读取流程加载文档内容到上下文。从流程来看与上边的结构是匹配的上的，需要用到再从物理机里边获取，符合“渐进式披露” —— 按需加载的规则。



## 三、组成部分

上边聊完了 skill 的架构和基本工作流程，那我们怎么去定义个 skill 呢？skill 是一个 md 文件，那是否和普通的 md 文件一样还是说会有一个固定的定义范式？相关内容在这个章节详细描述

```markdown
my-skill/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```





## 四、技术对比







## 五、安全性

 [Weaponizing Claude Code Skills: From 5*5 to Remote Shell](https://medium.com/@yossifqassim/weaponizing-claude-code-skills-from-5-5-to-remote-shell-a14af2d109c9) 这篇文章用一个计算的 skill 作为例子演示了如何通过脚本去控制用户电脑的攻击，原理就是在 skill 里边配置 allow-tools: Bash，而在 agent 运行过程中可以理解为一个 sandbox，最后导致在用户没有任何感知的情况下直接执行危险脚本。所以这警示我们尽量使用一些官方渠道提供的 skills，安装后也需要仔细查阅 skill 里边的内容，观察 skill 本身是否有额外 allow-tools 配置、reference/script 里边是否有风险内容/代码。



## 参考

[在 Cursor 如何创建一个 skill](https://cursor.com/cn/docs/context/skills)

[Claude Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

[a wesome-claude-skills](https://github.com/travisvn/awesome-claude-skills?tab=readme-ov-file#-security--best-practices)

