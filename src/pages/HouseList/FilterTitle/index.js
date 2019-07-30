import React from 'react'
import { Flex } from 'antd-mobile'

import styles from './index.module.css'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]
export default class FilterTitla extends React.Component {
  render() {
    return (
      <Flex align="center" className={styles.root} >
        {titleList.map((item) => {
          const isSelected = this.props.titleSelectedStatus[item.type]
          return (
            <Flex.Item align="center"
              key={item.type}
              onClick={() => this.props.onClick(item.type)}
            >
              <span className={[
                styles.dropdown,
                isSelected ? styles.selected : ''
              ].join(' ')}>
                <span>{item.title}</span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          )
        })}
      </Flex>

    )
  }
}