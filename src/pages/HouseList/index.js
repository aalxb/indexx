import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

// 导入API
import { API, getCurrentCity, BASE_URL } from '../../utils'

// 导入顶部搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
// 导入自己的吸顶组件
import Sticky from '../../components/Sticky'
// 导入 Filter 组件
import Filter from './Filter'

import styles from './index.module.scss'

// 房源列表项高度
const HOUSE_ITEM_HEIGHT = 120

export default class HouseList extends React.Component {
  state = {
    // 房源列表
    list: [],
    // 房源总数量
    count: 0,
    // 默认城市名称
    searchName: '上海',
    isLoaded: false
  }

  // 初始化 filters 数据
  filters = {}

  async componentDidMount() {
    this.searchHouseList()
    const { label } = await getCurrentCity()
    this.setState({
      searchName: label
    })
    // console.log(this.props)
  }

  // 接收 Filter 组件中传递过来的数据
  onFilter = filters => {
    this.filters = filters
    // 调用查询房源数据的方法
    this.searchHouseList()
  }
  // 发送获取列表的请求
  async searchHouseList(start = 1, end = 20) {
    const { value } = await getCurrentCity()
    // loading
    Toast.loading('拼命加载中...', null, null, false)
    const res = await API.get('/houses', {
      params: {
        ...this.filters,
        cityId: value,
        start,
        end
      }
    })
    Toast.hide()

    const { list, count } = res.data.body
    if (count > 0) {
      Toast.info(`共找到${count}套房源`, 3, null, false)
    }
    this.setState({
      list,
      count,
      isLoaded: true
    })
  }
  // 渲染房源列表
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]
    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }
    return (
      <HouseItem
        key={key}
        style={style}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        onClick={() => this.props.history.push(`/details/${item.houseCode}`)}
      />
    )
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    Toast.loading('loading...', null, null, false)
    return new Promise(async resolve => {
      const { value } = await getCurrentCity()
      const res = await API.get('/houses', {
        params: {
          ...this.filters,
          cityId: value,
          start: startIndex + 1,
          end: stopIndex
        }
      })
      resolve()
      // 添加新的加载房源数据
      const { count, list } = res.data.body
      this.setState({
        list: [...this.state.list, ...list],
        count
      })
      Toast.hide()
    })
  }
  renderHouseList = () => {
    const { count, isLoaded } = this.state

    if (isLoaded && count <= 0) {
      return (<p className={styles.center}>
        很遗憾~~~搜索失败 <br />
        换个条件再试试吧
        </p>)
    }

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
        minimumBatchSize={21}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => {
              return (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      width={width}
                      autoHeight
                      height={height}
                      rowCount={count}
                      rowHeight={HOUSE_ITEM_HEIGHT}
                      rowRenderer={this.rowRenderer}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                  )}
                </AutoSizer>
              )
            }}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    const { searchName } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航栏 */}
        <Flex className={styles.listHeader}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={searchName} className={styles.listSearch} />
        </Flex>

        {/* 条件筛选栏组件 */}
        <Sticky height={45}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房源列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}
