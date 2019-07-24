// z整个项目的入口文件
import React from 'react'
import ReactDOM from 'react-dom'
// icon
import './assets/fonts/iconfont.css'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import App from './App'
// d导入三方的样式
import 'antd-mobile/dist/antd-mobile.css'
import 'react-virtualized/styles.css'
import './index.css'
ReactDOM.render(<App />, document.getElementById('root'))