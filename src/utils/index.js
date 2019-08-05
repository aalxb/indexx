import axios from 'axios'
// import { resolve } from 'dns';
const CITY_KEY = 'hkzf_city'
// 获取localStorage中的定位城市
const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))
// 设置localStorage中的定位城市
const setCity = curCity => localStorage.setItem(CITY_KEY, JSON.stringify(curCity))
// 地图
const BMap = window.BMap

const getCurrentCity = () => {
  const curCity = JSON.parse(localStorage.getItem('hkzf_city'))

  if (!curCity) {
    return new Promise(resolve => {
      const myCity = new BMap.LocalCity()
      myCity.get(async result => {
        const res = await axios.get('http://localhost:8080/area/info', {
          params: {
            name: result.name
          }
        })
        // console.log(res)
        const { label, value } = res.data.body
        resolve({ label, value })
        localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      })
    })
  } else {
    return Promise.resolve(curCity)
  }
}

export { getCurrentCity, getCity, setCity }

export { BASE_URL } from './url'

export { API } from './api'

export { getToken, setToken, removeToken, isAuth } from './token'