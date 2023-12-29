export default [
  '',
  '/fronted/git/git.md',
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
      '/fronted/monitor/errorCapture/capture.md',
      '/fronted/monitor/performance/performance.md'
    ]
  },
]