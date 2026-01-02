# 具体案例

## `K[number]`
  
```ts
const pick = <R extends Record<string, any>, K extends readonly (keyof R)[]>(
  source: R,
  keys: K,
) => {
  return keys.reduce((acc, key: K[number]) => {
    if (key in source) {
      acc[key] = source[key];
    }
    return acc;
  }, {} as Pick<R, K[number]>) as> Pick<R, K[number];
};
```

这里我觉得有意思的点是在 reduce 使用了 `K[number]`，指代的含义是 K 中的某个属性

## `[T] = [undefined]`

[T] extends [undefined] vs T extends undefined 的区别：

T extends undefined
- 会进行分布式条件类型处理
- 当 T 是联合类型时，会分发到每个成员
- 例如：undefined | string 会变成两个分支的联合


[T] extends [undefined]
 - 会阻止分布式条件类型处理
- 将 T 作为整体进行检查
- 只有当 T 恰好是 undefined 时才为 true
- 对于联合类型，会检查整个联合类型是否等于 undefined

```ts
type ResolveMethod1<T> = [T] extends [undefined]
  ? (value?: T) => void
  : (value: T) => void;

type ResolveMethod2<T> = T extends undefined
  ? (value?: T) => void
  : (value: T) => void;
```


```ts
type Result2 = ResolveMethod2<undefined | string>;
```

是预期得到的结果是 `(value?: undefined) => void`

但实际类型推导过程分布式处理过程：
```ts
// 第一步：undefined 带入计算
(undefined extends undefined) ? (value?: undefined) => void : (value: undefined) => void 
// 得到
 (value?: undefined) => void

// 第二步：string 带入计算
(string extends undefined) ? (value?: string) => void : (value: string) => void 
// 得到
(value: string) => void

// 最后对两个结果做联合得到
((value?: undefined) => void) | ((value: string) => void)
```


```ts
type Result1 = ResolveMethod1<string | undefined>

// 直接带入推导
[string | undefined] extends undefined // 明显不满足
// 因此得到
(value: string | undefined): void
```


## `Job<T, TArgs = unknown[]> = (...args: TArgs) => T`

```ts
class Queue {
  push<TValue, TArgs extends unknown[]>(
    jobFactory: Job<TValue, TArgs>,
    ...args: TArgs
  ): Promise<TValue> {
  }
}
```

以上是一个队列的实现部分，整体的含义是 push 函数的返回值是 jobFactory 返回值 Promise 封装；同时从第二个参数开始与 jobFactory 函数的参数一一对象