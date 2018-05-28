import Axios from 'axios'
// import Qs from 'qs'
import Path from './path'

let instance = Axios.create({
  baseURL: Path
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   'X-Requested-With': true
  // },
  // timeout: 100000
  // transformRequest: [
  //   function (data) {
  //     if (!(data instanceof FormData)) {
  //       // FormFata不做处理
  //       data = Qs.stringify(data)
  //     }
  //     return data
  //   }
  // ],
  // transformResponse: [
  //   function (data) {
  //     // Do whatever you want to transform the data
  //     if (data.session_timeout) {
  //       sessionStorage.clear()
  //       window.location.href = path + '/logout'
  //     } else {
  //       return data
  //     }
  //   }
  // ],
  // // 返回数据类型
  // responseType: 'json'
})

// instance.interceptors.response.use(
//   response => {
//     if (response.data.code === -3) {
//       sessionStorage.clear()
//       window.location.href = path + '/logout'
//       return
//     }
//     return response.data
//   },
//   function () {
//     return Promise.reject(new Error(COMMON_SERVER_ERROR))
//   }
// )

export default instance
