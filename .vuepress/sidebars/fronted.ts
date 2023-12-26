export default [
  '',
  {
    title: 'Git',
    collapsable: true,
    children: [
      '/fronted/git/git.md'
    ]
  },
  {
    title: 'Javascript',
    collapsable: true,
    children: [
      '/fronted/javascript/Array.md',
      '/fronted/javascript/ES6.md',
      '/fronted/javascript/javascript.md',
    ],
  },
  '/fronted/typescript/typescript.md',
  {
    title: 'Vue',
    collapsable: false
  },
  {
    title: 'React',
    collapsable: false
  },
  {
    title: 'Electron',
    collapsable: false
  },
  {
    title: '前端监控',
    collapseable: false,
    children: [
      {
        title: '前端错误捕获',
        link: 'errorCapture/capture.md',
      },
      {
        title: '前端性能监控',
        link: 'errorCapture/performance.md',
      },
    ]
  },
]