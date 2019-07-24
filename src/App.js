import React from 'react'
// import { Button } from 'antd-mobile'
// 路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
// 导入页面
import Home from './pages/home'
import CityList from './pages/CityList'
import Map from './pages/Map'

export default class Person extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          {/* home */}
          <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
          <Route path="/home" component={Home} />
          <Route path="/map" component={Map} />
          {/* citylist */}
          <Route path="/citylist" component={CityList} />
        </div>
      </Router>
    )
  }
}
