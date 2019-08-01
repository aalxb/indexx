import React from 'react'

import FilterFooter from '../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue
  }
  // 捕获每一项的点击
  handleChange(id) {
    const { selectedValues } = this.state
    let newSelectedValues = [...selectedValues]

    if (selectedValues.indexOf(id) > -1) {
      // 如果点击了某一项
      newSelectedValues = newSelectedValues.filter(item => item !== id)
    } else {
      newSelectedValues.push(id)
    }
    this.setState({

      selectedValues: newSelectedValues

    })
  }

  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const { selectedValues } = this.state
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.handleChange(item.value)
          } >
          {item.label}
        </span >
      )
    })
  }

  render() {
    const { data: { roomType, oriented, floor, characteristic }, type, onSave, onCancel } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>
            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>
            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>
            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>
        {/* 底部按钮 */}
        <FilterFooter istext="清除" className={styles.footer} onCancel={() => this.setState({ selectedValues: [] })} onSave={() => onSave(type, selectedValues)} />
      </div>
    )
  }
}
