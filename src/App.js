import React from 'react'
// import { Button } from 'antd-mobile'
// 路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
// 导入页面
import Home from './pages/home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Details from './pages/Details'
import Login from './pages/Login'
import AuthRoute from './components/AuthRoute'
import Rent from './pages/Rent/index.js'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

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
          <Route path="/details/:id" component={Details} />
          <Route path="/login" component={Login} />
          {/* 用于登录之后才能展示的页面 */}
          <AuthRoute exact path="/rent" component={Rent} />
          <AuthRoute path="/rent/add" component={RentAdd} />
          <AuthRoute path="/rent/search" component={RentSearch} />
        </div>
      </Router>
    )
  }
}
