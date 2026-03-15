# PromQL

> PromQL 是什么？

引用社区的介绍 “PromQL（Prometheus Query Language）是 Prometheus 自己开发的表达式语言，语言表现力很丰富，内置函数也很多，使用它可以对 *<u>**时序数据**</u>* 进行筛选和聚合。” 这里需要注意下时序数据这个关键短语，从定义上解释就是按时间维度索引的数据，简单直白说这类数据描述了某个时间范围里边具体时间点的测量值。每个时序数据由以下三部分组成：

- 指标（metric）：指标名称和描述当前样本特征的 labelsets
- 时间戳（timestamp）：一个精确到毫秒的时间戳
- 样本值（value）： 一个 folat64 的浮点型数据表示当前样本的值



通过如下表达方式表示指定指标名称和指定标签集合的时间序列（按照时间发生先后顺序进行排列的数据点[序列](https://www.wikiwand.com/zh/articles/序列)）

```
<metric name>{<label name>=<label value>, ...}
```



## 数据类型

PromQL 表达式计算得到的值有几种类型：

- 瞬时向量：一组时序，每个时序只有一个采样值
- 区间向量：一组时序，时序包含一段时间内的多个采样值
- 标量数据：浮点数



## 时序选择器





## 运算规则





## 聚合操作符



## 参考

Prometheus 查询语法：https://github.com/tian197/project/blob/master/Kubernetes/promethues/prometheus%E6%9F%A5%E8%AF%A2%E8%AF%AD%E6%B3%95.md

Prometheus 官方文档：https://daichangya.github.io/prometheus.io/#/2-concepts/data_model

