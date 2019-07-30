import React from 'react'

// content
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 控制高亮的
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    openType: ''
  }
  // 控制高亮
  changeTitleSelected = (type) => {
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
        [type]: true
      },
      openType: type
    })
  }
  // 是否显示遮罩层
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  onSave = () => {
    this.setState({
      openType: ''
    })
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel}></div>
        ) : null}
        {/* 控制content */}
        <div className={styles.content}>
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.changeTitleSelected} />
          {openType === 'area' ||
            openType === 'mode' ||
            openType === 'price' ? (
              <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
            ) : null}

          {openType === 'more' ? <FilterMore /> : null}
        </div>

      </div>
    )
  }
}