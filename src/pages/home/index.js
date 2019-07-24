import React from 'react'
// 路由
import { Route } from 'react-router-dom'
// 导航Tabgar
import { TabBar } from 'antd-mobile';

// 页面
import HouseList from '../HouseList'
import Index from '../Index'
import News from '../News'
import Profile from '../Profile'
// 引入自己的样式
import './index.css'

const TABBARLIST = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/houselist' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false,
    fullScreen: true,
  }
  // 调用这个函数，来实现点击高亮
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  renderTarbarItems = () => {
    return TABBARLIST.map(item => (
      <TabBar.Item
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        title={item.title}
        key="Koubei"
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.props.history.push(item.path)
          // this.setState({
          //   selectedTab: item.path,
          // })
        }}
      >
      </TabBar.Item>
    ))
  }

  render() {
    return (
      <div className="home">
        {/* 页面 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/houselist" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* 引入样式 */}
        <div className="tarbar">
          <TabBar tintColor="#21B97A" noRenderContent={true}>
            {this.renderTarbarItems()}
          </TabBar>
        </div>
      </div>
    )
  }
}