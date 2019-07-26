import React from 'react'
// antd样式
import { Toast } from 'antd-mobile'
// 自己的样式
import './index.scss'
// 引入axios
import axios from 'axios'
// 引入自定义封装城市的定位方法
import { getCurrentCity, setCity } from '../../utils'
// 表格
import { List, AutoSizer } from 'react-virtualized';
// 头部
import NavHeader from '../../components/NavHeader'

// 专门处理城市列表索引的方法
const formatCityIndex = letter => {
  // console.log(letter)
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
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

// 搜索城市的列表 默认只有这几个城市有数据
const CITY_HAS_HOUSE = ['北京', '上海', '广州', '深圳']
export default class CityList extends React.Component {
  state = {
    // 城市列表数据（按字母顺序分类）
    cityList: {},
    // 城市索引列表
    cityIndex: [],
    activeIndex: 0
  }
  // 钩子
  componentDidMount() {
    this.getCityList()
    // this.listRef.current.measureAllRows()
  }
  // 切换城市的按钮
  chengeCity = ({ label, value }) => {
    // console.log(label, value)
    if (CITY_HAS_HOUSE.indexOf(label) > -1) {
      setCity({ label, value })
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }
  // 渲染没一行的方法
  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    const list = cityList[letter]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {list.map(item => (
          <div key={item.value} onClick={() => this.chengeCity(item)} className="name">
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 计算每行的高度
  calcRowHeight = ({ index }) => {
    // 传进来一个高度 index 标量
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    const list = cityList[letter]
    return 36 + 50 * list.length
  }
  // 滚动会触发改事件,用来设置高亮
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  // 点击直接跳转到首字母开头的城市
  goToCityIndex = index => {
    // console.log(index)
    this.listRef.current.scrollToRow(index)
  }
  // 获取右侧的ABCD
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return (
      cityIndex.map((item, index) => (
        <li className="city-index-item" key={item} onClick={() => this.goToCityIndex(index)}>
          <span className={index === activeIndex ? 'index-active' : ''}>
            {item === 'hot' ? '热' : item.toUpperCase()}
          </span>
        </li>
      ))
    )
  }
  // 创建 ref 对象，用来获取 List 组件实例
  listRef = React.createRef()
  // 获取城市列表的数据请求
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
    }, () => {
      this.listRef.current.measureAllRows()
    })
  }
  render() {
    return (
      <div className="citylist">
        {/* 城市选择 */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {/* 右侧列表abcd */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div >
    )
  }
}