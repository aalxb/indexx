import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.css'

function FilterFooter({ style, className, onCancel, onSave, istext }) {

  return (
    <Flex style={style} className={[styles.root, className || ''].join(' ')}>
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {istext}
      </span>
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onSave}>
        确定
      </span>
    </Flex>
  )
}
FilterFooter.defaultProps = {
  istext: '取消'
}

export default FilterFooter