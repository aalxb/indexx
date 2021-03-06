import React from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import axios from 'axios'
// 引入布局样式
import './index.scss'
// 获取城市的方法
import { getCurrentCity, BASE_URL } from '../../utils'
// 轮播图上的导航
import SearchHeader from '../../components/SearchHeader'

// nav的图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

export default class Index extends React.Component {
  state = {
    swipers: [],
    imgHeight: 212,
    isSwiperLoading: true,
    // nav数据
    nav1: [
      { href: '/home/houselist', src: nav1, title: '整租' },
      { href: '/home/houselist', src: nav2, title: '合租' },
      { href: '/map', src: nav3, title: '地图找房' },
      { href: '/rent/add', src: nav4, title: '去出租' },
    ],
    // 租房小组数据
    groups: [],
    // news
    news: [],
    searchName: '上海'
  }

  // 渲染数据前的构子
  async componentDidMount() {
    this.getSwipers()
    // this.getGroups()
    this.getNews()
    const { label } = await getCurrentCity()
    // console.log(label)
    this.setState({
      searchName: label
    })
  }

  // 获取轮播图请求
  async getSwipers() {
    let res = await axios.get('http://localhost:8080/home/swiper')
    this.setState({
      swipers: res.data.body,
      isSwiperLoading: false
    })
  }

  // 轮播图组件插入页面
  renderSwipers() {
    return (this.state.swipers.map(v => (
      <a
        key={v.id}
        href="####"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${v.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
    )
  }
  // nav组件插入到页面
  renderNav() {
    return (this.state.nav1.map(v => (
      <Link key={v.src} to={v.href}>
        <img src={v.src} alt="" />
        <p>{v.title}</p>
      </Link>
    )))
  }
  // 租房小组请求数据
  async getGroups() {
    let res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log(res.data.body)
    this.setState({
      groups: res.data.body
    })
  }

  // 请求最新资讯
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    this.setState({
      news: res.data.body
    })
  }
  // 最新资讯渲染
  renderNews() {
    return (this.state.news.map(v => (
      <div className="news-item" key={v.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${v.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{v.title}</h3>
          <Flex className="info" justify="between">
            <span>{v.from}</span>
            <span>{v.date}</span>
          </Flex>
        </Flex>
      </div>
    )))
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swipers">
          {/* 轮播图上的导航 */}
          <SearchHeader cityName={this.state.searchName} />
          {/* 轮播图的等待 */}
          {this.state.isSwiperLoading ? null : (
            <Carousel autoplay={true} infinite autoplayInterval={1000000}>
              {this.renderSwipers()}
            </Carousel>
          )}
        </div>
        {/* nav */}
        <div className="nav">
          {/* nav导航 */}
          <Flex justify="between">
            <Flex.Item>
              {this.renderNav()}
            </Flex.Item>
          </Flex>
        </div>
        {/* 租房小组 */}
        <div className="groups">
          <Flex justify="between" className="groups-title">
            <h3 className="h3">租房小组</h3>
            <span>更多</span>
          </Flex>
          <Grid columnNum={2}
            data={this.state.groups}
            hasLine={false}
            square={false}
            activeStyle
            renderItem={v => (
              <Flex className="grid-item" justify="between">
                <div>
                  <p>{v.title}</p>
                  <span>{v.desc}</span>
                </div>
                <div>
                  <img src={`${BASE_URL}${v.imgSrc}`} alt="" />
                </div>
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}