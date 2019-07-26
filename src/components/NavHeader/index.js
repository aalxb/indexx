import React from 'react'

import { NavBar } from 'antd-mobile'
// 校验属性
import PropTypes from 'prop-types'
// 自己的样式
import styles from './index.module.scss'
// 导入 withRouter 组件
import { withRouter } from 'react-router-dom'

function NavHeader({ children, history }) {
  return <NavBar
    className={styles.navBer}
    mode="light"
    icon={<i className="iconfont icon-back" />}
    onLeftClick={() => history.go(-1)}
  >
    {children}
  </NavBar>
}
// 校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}

// export default withRouter(NavHeader)
export default withRouter(NavHeader)
