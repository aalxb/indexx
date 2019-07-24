import axios from 'axios'
// import { resolve } from 'dns';

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

export { getCurrentCity }