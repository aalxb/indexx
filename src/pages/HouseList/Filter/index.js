import React from 'react'

// content
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API, getCurrentCity } from '../../../utils/index'
import styles from './index.module.css'
// 控制高亮的
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
// 选中的对象
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends React.Component {
  state = {
    // 高亮数据
    titleSelectedStatus,
    openType: '',
    // 筛选条件数据
    filtersData: {},
    // 选中的数据
    selectedValues
  }

  componentDidMount() {
    this.getFiltersData()
  }
  // 发送请求
  async getFiltersData() {
    const { value } = await getCurrentCity()
    const res = await API.get('/houses/condition', {
      params: {
        id: value
      }
    })
    this.setState({
      filtersData: res.data.body
    })
    // console.log(this.state.filtersData)
  }
  // 控制高亮
  changeTitleSelected = (type) => {
    // console.log(type)
    const { titleSelectedStatus, selectedValues } = this.state
    // 获取有个新的标题选中的对象
    const newtitleSelectedStatus = { ...titleSelectedStatus }
    // 遍历对象
    Object.keys(titleSelectedStatus).forEach(key => {
      // 获取每一个菜单的选中项
      const selectedVal = selectedValues[key]
      if (key === type) {
        newtitleSelectedStatus[type] = true
      } else {
        // 当前类型是否选中
        const typeSelected = this.getTitleSelectedStatus(key, selectedVal)
        Object.assign(newtitleSelectedStatus, typeSelected)
      }
    })
    this.setState({
      titleSelectedStatus: newtitleSelectedStatus,
      openType: type
    })
  }
  // 高亮逻辑
  getTitleSelectedStatus(type, selectedVal) {
    const newTitleSelectedStatus = {}
    if (
      type === 'area' &&
      (selectedVal.length === 3 || selectedVal[0] === 'subway')
    ) {
      // 选中
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 选中
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 选中
      newTitleSelectedStatus[type] = true
    } else if (type === 'more') {
    } else {
      // 不选中
      newTitleSelectedStatus[type] = false
    }


    return newTitleSelectedStatus
  }
  // 是否显示遮罩层
  onCancel = (type) => {
    // console.log(type)

    const { selectedValues, titleSelectedStatus } = this.state
    const selectedVal = selectedValues[type]
    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, selectedVal)
    this.setState({
      openType: '',
      titleSelectedStatus: { ...titleSelectedStatus, ...newTitleSelectedStatus }
    })
  }
  onSave = (type, value) => {
    console.log(type, value)
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, value)

    this.setState({
      openType: '',

      titleSelectedStatus: {
        ...titleSelectedStatus,
        ...newTitleSelectedStatus
      },

      // 更新当前类型对应的选中值
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      }
    })
  }
  // 渲染筛选列表
  renderFilterMore() {
    const { openType, filtersData: { roomType, oriented, floor, characteristic } } = this.state
    if (openType !== 'more') return null

    const data = { roomType, oriented, floor, characteristic }
    return <FilterMore data={data}></FilterMore>
  }
  // 渲染选择城市选择的列表
  renderFilterPicker = () => {
    const { openType, filtersData: { area, subway, rentType, price }, selectedValues } = this.state
    if (openType === 'more' || openType === "") {
      return null
    }
    // area： area => {}, subway => {}
    // mode： rentType => []
    // price：price => []
    // 数据
    let data
    // 列数
    let cols = 1
    // 判断
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        break;
      case 'price':
        data = price
        break;
      default:
        break;
    }
    return <FilterPicker
      key={openType}
      data={data}
      cols={cols}
      onCancel={this.onCancel}
      onSave={this.onSave}
      type={openType}
      defaultValue={defaultValue}
    />
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={() => this.onCancel(openType)}></div>
        ) : null}
        {/* 控制content */}
        <div className={styles.content}>
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.changeTitleSelected} />
          {this.renderFilterPicker()}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}