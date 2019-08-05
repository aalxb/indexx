import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入 formik 组件
import { withFormik, Form, Field, ErrorMessage } from 'formik'

// 导入表单校验schema
import * as Yup from 'yup'

import { API, setToken } from '../../utils'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.scss'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  render() {
    // const { username, password } = this.state
    return (
      < div className={styles.root} >
        {/* 顶部导航 */}
        < NavHeader className={styles.navHeader} > 账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                autoComplete="off"
                name="username"
                placeholder="请输入账号"
              />
              <ErrorMessage
                name="username"
                component="div"
                className={styles.error}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit" >
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div >
    )
  }
}

Login = withFormik({
  mapPropsToStatus: () => ({ password: '', username: '' }),
  // validationSchema
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线 '),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到8位，只能出现数字、字母、下划线 ')
  }),
  handleSubmit: async (values, { props }) => {

    const { username, password } = values
    const res = await API.post('/user/login', {
      username,
      password
    })
    const { status, description, body } = res.data
    if (status === 200) {
      setToken(body.token)
      props.history.go(-1)
    }
    else {
      Toast.info(description)
    }
  }
})(Login)



export default Login
