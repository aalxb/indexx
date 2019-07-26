import React from 'react'
import axios from 'axios'
// 定位城市的方法
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
  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  async initMap() {
    const { label, value } = await getCurrentCity()
    // console.log(label, value)
    // container 容器的id值
    const map = new BMap.Map('container')
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
          // 请求数据
          const res = await axios.get(`http://localhost:8080/area/map`, {
            params: {
              id: value
            }
          })
          const arr = res.data.body
          arr.forEach(item => {
            const { coord: { longitude, latitude } } = item
            const point = new BMap.Point(longitude, latitude)
            // 覆盖物
            const opts = {
              position: point,
              offset: new BMap.Size(-35, -35)
            }
            const label = new BMap.Label('', opts)
            label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${item.label}</p>
              <p>${item.count}套</p>
            </div>
            `)

            label.setStyle(labelStyle)

            map.addOverlay(label)
          })
        }
      },
      label
    )
  }
  render() {
    return (
      <div className='map'>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className="container" />
      </div>
    )
  }
}
