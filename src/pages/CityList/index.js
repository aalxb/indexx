import React from 'react'
// antd样式
import { NavBar } from 'antd-mobile'
// 自己的样式
import './index.scss'
// 引入axios
import axios from 'axios'
// 引入自定义封装城市的定位方法
import { getCurrentCity } from '../../utils'
// 表格
// import List from 'react-virtualized/dist/commonjs/List'
import { List } from 'react-virtualized';

// 渲染的列表数据
const list = Array.from(new Array(100)).map(
  (item, index) => `${index} -- 组件列表项`
)
// 渲染没一行的方法
function rowRenderer({
  key,
  index,
  style,
  isVisible,
  isScrolling
}) {
  return (
    <div key={key} style={style}>
      {list[index]} - {isScrolling + ''} -- {isVisible + ''}
    </div>
  )
}

// 封装排序列表的函数
const formatCityList = list => {
  const cityList = {}
  list.forEach(item => {
    const firstLetter = item.short.substr(0, 1)
    if (firstLetter in cityList) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

export default class CityList extends React.Component {
  state = {
    // 城市列表数据（按字母顺序分类）
    cityList: {},
    // 城市索引列表
    cityIndex: []
  }
  componentDidMount() {
    this.getCityList()
  }
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    // console.log(res.data.body)
    const { cityList, cityIndex } = formatCityList(res.data.body)
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.data.body
    // console.log(cityList, cityIndex) 排好序列的数据
    const curCity = await getCurrentCity()
    cityIndex.unshift('#')
    cityList['#'] = [curCity]

    // console.log(cityList, cityIndex)
    this.setState({
      cityList,
      cityIndex
    })
  }
  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => console.log('onLeftClick')}
        >城市选择</NavBar>
        <List
          width={375}
          height={300}
          rowCount={list.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
        />
      </div >
    )
  }
}