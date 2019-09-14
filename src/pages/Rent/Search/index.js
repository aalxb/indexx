import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'
import { async } from 'q';

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 初始化定时器
  timeId = null
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state
    return (
      tipsList.length > 0 ? tipsList.map(item => (
        <li key={item.community} className={styles.tip} onClick={this.handleClick.bind(this, item)}>
          {item.communityName}
        </li>
      )) : <div>沒有更多信息</div>
    )
  }
  handleClick = ({ community, communityName }) => {
    this.props.history.replace('/rent/add', {
      community,
      communityName
    })
  }

  handleSearchTxt = (val) => {
    this.setState({
      searchTxt: val
    })
    // this.search(val)
    clearTimeout(this.timeId)
    this.timeId = setTimeout(async () => {
      const res = await API.get('/area/community', {
        params: {
          name: val,
          id: this.cityId
        }
      })
      const { body } = res.data
      // console.log(body)
      this.setState({
        tipsList: body.map(item => ({
          community: item.community,
          communityName: item.communityName
        }))
      })
    }, 500)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleSearchTxt}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
