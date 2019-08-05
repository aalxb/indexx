import React, { createRef } from "react"
import styles from './index.module.scss'
import PropTypes from 'prop-types'

class Sticky extends React.Component {
  // content 
  contentRef = createRef()
  // 占位符
  placeholderRef = createRef()

  // 滚动事件的处理
  handleScroll = () => {
    // debugger
    const { height } = this.props
    // 占位符对象  这个地方有问题
    const placeholderEl = this.placeholderRef.current
    // dom对象
    const contentEl = this.contentRef.current
    // getBoundingClientRect 获取事件的值
    const { top } = placeholderEl.getBoundingClientRect()
    if (top < 0) {
      placeholderEl.style.height = `${height}px`
      contentEl.classList.add(styles.fixed)
    } else {
      placeholderEl.style.height = `0px`
      contentEl.classList.remove(styles.fixed)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位符 */}
        <div ref={this.placeholderRef}></div>
        {/* 内容 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired
}

export default Sticky