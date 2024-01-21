# React 进阶


## :last_quarter_moon_with_face: npx

[廖大神--学习链接](https://www.ruanyifeng.com/blog/2019/02/npx.html)

[facebook](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

[react 基础知识](https://gitee.com/react-cp/react-pc-doc/blob/master/1.%E5%9F%BA%E7%A1%80%E6%96%87%E6%A1%A3/react-%E5%9F%BA%E7%A1%80.md)

:key: npx 是 npm 的一个包管理器，在 npm version5 版本就已经默认支持了，如果提示未安装的话可以手动全局安装一下。

```bash
### 
npm install -g npx 
```

npx 解决了什么问题？在项目中的一些包我们有两种方式进行调用

1. 在命令行中输入路径引用到 node_modules 的包进行调用
2. 在 package.json 的 script 中添加运行脚本

这两种方式其实都是比较烦琐的，npx 其实就是为了解决这个问题，让项目内部安装的包用起来更加方便，也符合它作为一个二进制包运行管理器的工具。



### 运行原理

npx 运行的原理是会从当前项目开始，在 node_modules 文件夹中寻找对应包的 bin 目录，如果当前找不到会到上层文件夹中寻找，直到全局的 $path 环境变量，找不到就会下载对应的包了。

````bash
###
npm install --save-dev cowsay

###
npx cowsay hello

### 
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
````

上面是一个经典的例子，跑了之后就会有个小牛跟你说 hello 了。





## :nerd_face: react 脚手架



```bash
# 可以帮我们快速地搭建 react 应用
npx create-react-app app-name
```

:star: 官方其实是推荐我们使用上面这种方式去创建的，可能原来我们全局安装了 create-react-app 这个包，我们可以把它全局删除掉直接使用上面的方式去创建。



## :jack_o_lantern: react 入口文件

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

const myFirstElement = <h1>Hello React!</h1>

/* 本质上就是通过这段代码去实现根页面的挂载 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(myFirstElement);
```

- 其实并不难理解，因为在 vue 中，我们其实也有一个入口文件 main.js

```js
import App from './App.vue'
const app = createApp(App)
// createApp 其实就是上面的 render 函数
```



## :heart_eyes_cat: react render html



:star: ReactDOM.render() 

* 渲染的 HTML
* 挂载的容器



## :wink:  react jsx



jsx 其实是支持我们在 JS 文件中编写 HTML 代码的文件格式，我们可以通过 { } 插入对应的 HTML 代码，我们不用管它最后是怎么解析得到HTML的，其实 react 内部会帮我们去处理。 {  } 其实和 Vue 里面的模版插值 {{  }} 有点类似，其实接受的都是表达式或者变量.



> jsx 其实本质上是对创建 HTML 元素的过程进行了封装，允许我们在 JS 中编写 HTML 代码

```js
// 使用 JSX 语法
const myElement = <h1>I Love JSX!</h1>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(myElement);

// 不使用 JSX 语法
const myElement = React.createElement('h1', {}, 'I do not use JSX!');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(myElement);
```

:star: 在 JSX 中，我们可以使用 () 包裹需要定义的 HTML 代码，使用 {} 包裹表达式(编译的时候会进行求值计算)



:exclamation: 需要注意以下几点

1. class --> className (因为 class 和 关键字冲突了)
2. 对应必须得有一个根元素

```jsx
{/* 这样子是不 ok 的 */
    <p></p>
    <p></p>
}

{/* 这样子是 ok 的 */
    <><!-- 最后不会解析到页面上所以可能有时候使用实义的标签更好比如 div/p. -->
   	 <p></p>
   	 <p></p>
    <>
}
```

3. 对应的标签必须要闭合，要么是自闭合，要么是有结束标签

```html
<input /> <!-- 自闭合标签 -->
<div></div> <!-- 开始标签&结束标签 -->
```





## :star2: react components



### class 组件

````js
class Car extends React.Component {
  render() {/* 渲染HTML结构 */
    return <h2>Hi, I am a Car!</h2>;
  }
}
````



class 组件传递 props 

```js
class Car extends React.Component {
  constructor(props) {/* 如果存在 super 必须将 props 传递给 super 函数 */
    super(props);
  }
  render() {
    return <h2>I am a {this.props.model}!</h2>;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Car model="Mustang"/>);
```





### function 组件

```js
function Car() {
    return (
    	<h2>Hi, I am a Car!</h2>
    )
}
```

:wink: react 的组件是可复用的，所以我们一般可以抽取这些组件到一个独立 JS /TS 文件中，通过 ES6 模块进行导出和引用从而达到复用的目的。





## :star2:react  生命周期

:key: 生命周期是一个非常重要的概念，就是说理解生命周期对理解组件的渲染是非常有帮助的，在学习其他东西的时候其实很多都是基于声明周期去理解的。

[CSDN](https://blog.csdn.net/qq_44906900/article/details/111214531)

[官方文档](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)



react 的生命周期主要分为三个阶段：挂载，更新，销毁



### 挂载阶段

:wink: 挂载阶段主要做的就是初始化 props 和 state 然后进行 HTML 的渲染

1. constructor() :point_right: 初始化
2. static getDerivedStateFromProps(prop, state) :point_right: 返回一个对象合并 state 的值
3. render() :point_right: 渲染页面
4. componentDidMount() :point_right: 组件已经渲染到DOM 后运行(帮助我们拿到对应的 DOM 节点)



### 更新阶段

:smile: 更新阶段主要做的是监听 state 和 props 的变化

1. static getDerivedStateFromProps(props, state) :point_right: 返回一个对象合并 state 的值
2. shouldComponentUpdate(): boolean :point_right: 是否继续渲染下去，通过返回一个布尔值去控制
3. render() :point_right: 根据新的数据重新渲染页面
4. getSnapshotBeforeUpdate(prevProps, prevState)  :point_right: 获得更新前的数据
5. componentDidUpdate() :point_right: 更新完成





### 销毁阶段

:stuck_out_tongue_winking_eye: 销毁阶段主要做的就是在组件销毁的时候执行回调函数

1. componentWillUnmount()  :point_right: 准备销毁元素



## :key: react props



props 的概念其实和 vue 是一样的，也就父子组件之间的通信方式

1. 传递静态数据 
2. 传递变量数据 { }

```js
function Car(props) {
  return <h2>I am a { props.brand }!</h2>;
}

function Garage() {
  const name = 'Ford'
  return (
    <>
      <h1>Who lives in my garage?</h1>
      <Car brand="Ford" /> <!-- 传递静态变量 -->
      <!-- 传递动态变量 -->
       <Car brand={name} /> 
    </>
  );
}
```





## :snowman: react event



```html
<body>
  <!-- 在 html 中 click 触发的时候是执行绑定的代码
	所以像下面这个是不行的，得使用 handleClick() 的方式-->
  <div onclick="handleClick">点击</div>
  <script>
    function handleClick() {
      console.log('click')
    }
  </script>
</body>
```



- 在 react 中，其实是支持绑定函数变量的

```html
<!-- 生效 -->
<button onClick={shoot}>Take the Shot!</button>
```

- 传递 event 事件

````html
<!-- 通过参数传递 event 对象 -->
<button onClick={(event) => shoot("Goal!", event)}>Take the shot!</button>
````



## :construction_worker: react list



```js
function Car(props) {
  return <li>I am a { props.brand }</li>;
}

function Garage() {
  const cars = ['Ford', 'BMW', 'Audi'];
  return (
    <>
      <h1>Who lives in my garage?</h1>
      <ul>
       <!-- 需要为每个 Car 绑定一个 key 值以便在数据更新的时候 react 选择性更新DOM节点 -->
        {cars.map((car) => <Car brand={car} />)}
      </ul>
    </>
  );
}
```





## :question: [react forms](https://www.w3schools.com/react/react_forms.asp)



这里面的概念很多都是 react 里面表单的概念，包括了 input , select, textarea ……，里面还提及到了 react hooks 的概念，所以我觉得还是有必要在了解了 hooks 后再来回看这一章节。





## :key: react router 

```bash
# 安装类似于 vue-router 的东西
npm install -D react-router-dom
```

```jsx
/* 导入对应的路由然后进行组件的挂载 */
export default function App() {
  return (
    <!-- 包裹路由 -->
    <BrowserRouter>
      <Routes> <!-- 下面每一个 Route 就是路由列表 -->
        <Route path="/" element={<Layout />}> <!-- 下面是嵌套的子路由 -->
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```



## :joy: react css style



在 react 组件中引入 CSS 样式，方法有：

- 直接使用行内样式

```jsx
<div style={{ backgroundColor: red }}></div>
```

需要注意的的是原来在 CSS 中的短横线属性名需要写成驼峰命名的格式

```jsx
/* 这样子导入也是可以的 */
const style = {
    backgroundColor: red,
    color: blue
}
<div style={style}></div>
```



- 将样式单独抽离到一个 CSS 文件中，在组件中直接引入

```jsx
import './App.css'
```



- CSS Modules

```jsx
/* 样式文件 -- 比如定义为 xxx.module.css */
.bgblue {
    color: blue,
    b
}

/* 组件 */
import style from './App.css'
<div className={style.bgblue}></div>
```





## :wink:  react 文档高级指引









## :key: react hooks



react hooks 解决的问题是：以前只有类式组件才能使用使用 state，使得数据是可响应的，但是其实类式组件相比于函数组件没有那么直观，react hooks 的引出其实就是为了解决这个问题。除了具备 state 的访问权限以外，hook 还可以允许函数组件访问其他 React 特性。



[知乎详解](https://zhuanlan.zhihu.com/p/65773322)



### useState



#### 传统方式

替代了类式组件定义 state 的方式，传统也就是 react 16 之前的话

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    // 需要在构造函数初始化 state
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

:exclamation: 需要注意的一些问题

1. 不要直接修改 state

```jsx
this.state.date = '' // 并不会触发视图的更新
this.setState({}) // 必须使用 setState 函数才会触发视图的更新
```

2. state 更新是异步的

```jsx
this.setState({
  counter: this.state.counter + this.props.increment,
}); // 不生效 -- 我觉得原因很可能在 state 和 props 的更新时机不一致导致说 state 更新完成还需要等待 props 的完成指令，从而导致视图没办法改变


/* state 拿到的是更新的 state, props 拿到的是更新 */
this.setState((state, props) => {
    return ...
})
```

3. state 更新可能会被合并

```jsx
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
      /* 方法内部调用 */
     this.setState({
        posts: response.posts
     });
  }
```

:smile: 意思大概就是会执行 Object.assign 的操作形成一个浅拷贝从而触发视图的响应



#### 新版本方式

````jsx
export function Hooks() {
  const [color, setColor] = useState('red') /* init base variables */
  const [car, setCar] = useState({/* init object */
    brand: "Ford",
    model: "Mustang",
    year: "1964",
    name: '宝马'
  })

  return (
    <>
      <div className={hookStyle.container}>
        <div style={{ margin: '10px' }}>{ color }</div>
        <div className={hookStyle.car}>{ car.name }</div>
        <button onClick={() => setColor('blue')}>更新颜色</button>
        <button onClick={() => setCar(previous => {
          /* 需要注意这里，不这样子写的话会抹掉其他属性 */
          return { ...previous, name: '奥迪' }
        })}>更换汽车名</button>
      </div>
    </>
  )
}
````



### useEffect

useEffect用于处理组件中的effect，通常用于请求数据，事件处理，订阅等相关操作。需要注意一个问题就是每次页面渲染的时候都会执行这个函数的回调方法，注意是每次！！！也就是说如果内部也有更新视图的操作的话会再次执行，那如果内部是个 setInterval 函数的话就会陷入死循环。

- 控制 useEffect 执行时机的手段

````jsx
/* 仅在第一次视图渲染的时候执行 */
useEffect(() => {
}, []);

/* 第一次渲染 & prop state 发生变化时 */
useEffect(() => {
}, [prop, state]);

/* 第一次渲染 & color 发生变化时 */
useEffect(() => {
}, [color]);
````





### useContext

有这么一种情况，就是说我们在使用嵌套组件的时候很可能出现像下面一样多层嵌套的情况。总体来看，其实是 Component1 组件将 user 传递给 Component5 状态，但是传递的过程中 Component2 …… 其实都是不需要 user 变量来渲染视图的，这就带来了一个传递冗余的问题，那么 useContext 就是用来解决这个问题的。

- 本质上是通过定义一个全局共享的容器，容器内的组件都能读取到容器内的变量

```jsx
function Component1() {
  const [user, setUser] = useState("Jesse Hall");

  return (
    <>
      <h1>{`Hello ${user}!`}</h1>
      <Component2 user={user} />
    </>
  );
}

function Component2({ user }) {
  return (
    <>
      <h1>Component 2</h1>
      <Component3 user={user} />
    </>
  );
}

function Component3({ user }) {
  return (
    <>
      <h1>Component 3</h1>
      <Component4 user={user} />
    </>
  );
}

function Component4({ user }) {
  return (
    <>
      <h1>Component 4</h1>
      <Component5 user={user} />
    </>
  );
}

function Component5({ user }) {
  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user} again!`}</h2>
    </>
  );
}
```

```jsx
const UserContext = createContext(); // 创建共享容器
function Component1() {
  const [user, setUser] = useState("Jesse Hall");

  return (
    <UserContext.Provider value={user}>
      <h1>{`Hello ${user}!`}</h1>
      <Component2 user={user} />
    </UserContext.Provider>
  );
}

function Component5() {
  const user = useContext(UserContext);

  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user} again!`}</h2>
    </>
  );
}
```



### useRef

:star: 灰常重要的 api 



#### 用途一

我们希望更新一个值但是这个更新的操作并不会带来页面的 re-render(重新渲染)，比较常见的一个场景就是说我们想在 useEffect 获取页面重新渲染的次数 :point_down:

```jsx
useEffect(() => {
    count.current += count.current 
})
```

- 如果 count 的改变是可以引起页面重新渲染的，那么就会导致 useEffect 的无限循环，所以我们需要用到一个 api 叫 useRef 来帮助我们标识这种类型的变量。？？？重新渲染我的理解是像 Vue 一样组件的销毁和重新创建的过程，单纯只是数据替换然后视图变化的应该不算是重新渲染(这样的理解可能有误 :no_entry: )
- :key: 到底啥是重新渲染。[解析](https://cloud.tencent.com/developer/article/1901142) -- 可以理解为每一次函数的执行就是重新渲染的过程，重新渲染的过程中其实都会产生独立的 state prop, 因此不同渲染的 state 和 prop 是没有关系的，仅仅是说当前渲染的修改是基于上一次的值进行而已(react 内部处理)
- 用法：类似于一个 { current: 'xxx' } 的对象

```jsx
function App() {
  const [inputValue, setInputValue] = useState("");
  const count = useRef(0);

  useEffect(() => {
    /* 不会导致页面重新渲染 */
    count.current = count.current + 1;
  });

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <h1>Render Count: {count.current}</h1>
    </>
  );
}

```



#### 用途二

可以用来访问 HTML 元素，与 Vue 里面的使用 ref 引用 DOM 是一样的意思

```jsx
function App() {
  const inputElement = useRef();

  const focusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```



### useReducer

与 useState 一样其实都是定义 state 数据，但是在处理复杂逻辑的时候相比于 useState 更优。

- useState 定义的时候给我们提供了更新数据的函数，但是也仅限于传入值来进行更新，不能够实现里面细致逻辑判断的更新，比如说我只想更新 id 为 1的数据，其实是做不到的。
- 由此引出 useReducer

```jsx
const todos = {
  id: 1,
  title: 'Todo 1',
  complete: false
}

/** 
 * @param {*} state useReducer 初始化的数据
 * @param {*} action dispatch 传递的参数
 */
const reducer = (state, action) => { /* 修改依然会触发 re-render */
  console.log(state)
  console.log(action)
  return {
    ...state,
    complete: !state.complete
  }
}

export function Reducer() {
  /* t 对应的是 todos, dispatch 对应的是 reducer */
  /* useReducer: () => return [todos, reducer]  */
  const [t, dispatch] = useReducer(reducer, todos)

  useEffect(() => {
    console.log('re render')
  })

  // 渲染 checkbox 选择框
  return (
    <>
    {/* dispatch 可以附带参数作为action */}
    {/* dispatch 只接受一个参数，其余不能解构 */}
    {/* 若要传递多参数，可通过数组的形式传递 */}
      <button onClick={() => dispatch({}, {}, {})}>dispatch</button>
    </>
  )
}
```





### useCallback & useMemo

-  它们两个其实都是用于提升性能的 api， 可能有时候父组件中子组件外的渲染会导致子组件内部的更新，但其实这是不合理的，因为其实更新并不涉及子组件内部的内容，所以我们可以约定一定的缓存效果，指定在某个特定的情况下子组件才会去重塑更新。
  - useCallback
    - 当指定依赖更新以后才会去重塑函数，否则缓存
    - 主要的场景应该是解决父子组件中子组件重复渲染的问题
  - useMemo
    - 当指定依赖更新以后才会去执行回调函数并返回值，否则缓存
    - 强调的是函数返回值

```jsx
export function Memo() {
  const [count, setCount] = useState(0)
  const [todos, setTodos] = useState([])

  const expensive = (count = 0) => {
    for(let i=0; i<1000000000; i++) {
      count += 1
    }
    return count
  }
  // re-render 的时候严重影响性能
  // const calculation = expensive(count)
  // 因此我们可以设置 expensive 的计算只在 count 发生改变以后才进行
  const calculation = useMemo(() => expensive(count), [ count ])

  const increaseCount = () => {
    setCount((c) => c + 1)
  }

  useEffect(() => {
    console.log(todos)
  })

  const increaseTodos = () => {
    // 导致 re-render 重新执行 Memo 函数导致 calculation 的重新计算
    setTodos((c) => {
      return [...c, 1]
    })
  }

  return (
    <>
      <button onClick={increaseTodos}>add todos</button>
      <ul>
        { todos.map(item => (
          <li key={Math.random() + ''}>Todo Item: {item}</li>
        )) }
      </ul>
      <button onClick={increaseCount}>add count</button>
      <div>Count: {count}</div>
      <span>Calculation: {calculation}</span>
    </>
  )
}
```



## react 面试相关



### React 事件机制





### React 逻辑代码复用





### React Fiber

React V15 在渲染时，会递归比对 VirtualDOM 树，找出需要变动的节点，然后同步更新它们， 一气呵成。这个过程期间， React 会占据浏览器资源，这会导致用户触发的事件得不到响应，并且会导致掉帧，**导致用户感觉到卡顿**。



为了给用户制造一种应用很快的“假象”，不能让一个任务长期霸占着资源。 可以将浏览器的渲染、布局、绘制、资源加载(例如 HTML 解析)、事件响应、脚本执行视作操作系统的“进程”，需要通过某些调度策略合理地分配 CPU 资源，从而提高浏览器的用户响应速率, 同时兼顾任务执行效率。

所以 React 通过Fiber 架构，让这个执行过程变成可被中断。“适时”地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互，还有其他好处:

- 分批延时对DOM进行操作，避免一次性操作大量 DOM 节点，可以得到更好的用户体验；
- 给浏览器一点喘息的机会，它会对代码进行编译优化（JIT）及进行热代码优化，或者对 reflow 进行修正。



fiber 工作机制图

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d72ff31fd9af4f95899572d8b8bde57b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)



#### [Fiber树的遍历和完成顺序](https://www.cnblogs.com/fengyuqing/p/15074207.html)

- 从顶点开始遍历
- 如果有第一个儿子，先遍历第一个儿子
- 如果没有第一个儿子，标志着此节点遍历完成
- 如果有弟弟遍历弟弟
- 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
- 没有父节点遍历结束
- 遍历顺序：A1 B1 C1 C2 B2
- 完成顺序：C1 C2 B1 B2 A1 ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5fa4228b0f40c78cc99d1ccc44c719~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)
