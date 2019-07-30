import React from 'react'
import axios from 'axios'
// 定位城市的方法
import classNames from 'classnames'
// loading效果
import { Toast } from 'antd-mobile'
import { getCurrentCity } from '../../utils'

import './index.scss'
import styles from './index.module.css'

// 头部
import NavHeader from '../../components/NavHeader'
// 地图
const BMap = window.BMap

const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowHouseList: false
  }
  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  async initMap() {
    const { label, value } = await getCurrentCity()
    // console.log(label, value)
    // container 容器的id值
    const map = new BMap.Map('container')
    this.map = map
    // 解析实例
    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      // 地图的渲染过程
      async point => {
        if (point) {
          map.centerAndZoom(point, 11)
          // 添加两个常用控件
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
          this.renderOverlays(value)
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      // console.log('移动了')
      this.setState({
        isShowHouseList: false
      })
    })
  }
  // 封装一下，根据不同的 id 渲染不通的 区 镇 小区
  getTypeAndZoom() {
    const curZoom = this.map.getZoom()
    // 下一级缩放级别
    let nextZoom
    // 覆盖物
    let type
    if (curZoom >= 10 && curZoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (curZoom >= 12 && curZoom < 14) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
    }
    return { nextZoom, type }
  }
  // 获取下级数据
  async renderOverlays(id) {
    Toast.loading('loading', null, 0, false)
    const res = await axios.get(`http://localhost:8080/area/map`, {
      params: {
        id
      }
    })
    Toast.hide()
    const { nextZoom, type } = this.getTypeAndZoom()
    res.data.body.forEach(item => {
      this.createOverlays(type, nextZoom, item)
    })
  }
  // 渲染下级的具体数据
  createOverlays(type, nextZoom, item) {
    const { label, count, value, coord: { latitude, longitude } } = item
    // 坐标
    const point = new BMap.Point(longitude, latitude)
    // 判断是哪个下级，
    if (type === 'rect') {
      this.createRect(label, count, value, point)
    } else {
      this.createCircle(label, count, value, point, nextZoom)
    }
  }
  // 创建区镇的覆盖物
  createCircle(name, count, id, point, zoom) {
    const opts = {
      position: point,
      offset: new BMap.Size(-35, -35)
    }
    const label = new BMap.Label('', opts)
    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${name}</p>
      <p>${count}套</p>
    </div>
    `)
    label.setStyle(labelStyle)
    label.addEventListener('click', () => {
      // console.log('点击了', id, zoom)
      this.renderOverlays(id)
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      this.map.centerAndZoom(point, zoom)
    })
    this.map.addOverlay(label)
  }
  // 小区覆盖物
  createRect(name, count, id, point) {
    const opts = {
      position: point,
      offset: new BMap.Size(-50, -24)
    }
    const label = new BMap.Label('', opts) // 创建文本标注对象

    // 设置房源覆盖物的HTML内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    // 加上样式
    label.setStyle(labelStyle)
    // 移动事件
    label.addEventListener('click', (e) => {
      const { clientX, clientY } = e.changedTouches[0]
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330 + 45) / 2 - clientY
      this.map.panBy(x, y)
      this.getCommunityHouses(id)
    })
    this.map.addOverlay(label)
  }
  // 获取小区房源数据
  async getCommunityHouses(id) {
    Toast.loading('拼命加载中.....', null, 0, false)
    const res = await axios.get(`http://localhost:8080/houses`, {
      params: {
        cityId: id
      }
    })
    Toast.hide()
    // console.log(res)
    this.setState({
      isShowHouseList: true,
      houseList: res.data.body.list
    })
  }
  // 小区房源列表
  renderHouseList() {
    return this.state.houseList.map(item => (
      <div className={styles.house} key={item.houseCode} onClick={() => {
        this.props.history.push(`/detail/${item.houseCode}`)
      }}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const tagClass = `tag${index > 2 ? '3' : index + 1}` // tag1 or tag2 or tag3
              return (
                <span
                  key={index}
                  className={[styles.tag, styles[tagClass]].join(' ')}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className='map'>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className="container" />
        <div
          className={classNames(styles.houseList, {
            [styles.show]: this.state.isShowHouseList
          })}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
