import React from 'react'
import { Flex } from 'antd-mobile'

import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from './Filter'

export default class Index extends React.Component {
  state = {
    cityName: '上海'
  }

  render() {
    const { cityName } = this.state
    return (
      <div className={styles.root}>
        <Flex className={styles.listHeader}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={cityName} className={styles.listSearch} />
        </Flex>
        <Filter />
      </div>
    )
  }
}