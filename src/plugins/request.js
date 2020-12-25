import axios from 'axios'

// 导入NProgress 包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const MyHttpServer = {}

MyHttpServer.install =(Vue) => {
  // 配置请求根路径
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

  // 授权API,必须在请求头中使用 Authorization 字段提供token
  // axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')

  // 在request拦截器中，展示进度条NProgress.start()
  // 在请求到达服务器之前，先调用use中的这个回调函数来添加请求头信息
  axios.interceptors.request.use(config => {
    NProgress.start()
    // console.log(config)
    // 为请求头对象，添加token验证的Authorization字段
    if (config.url !== 'login') {
      config.headers.Authorization = window.localStorage.getItem('token')
    }
    // 返回配置
    return config
  })

  // response 拦截器中，隐藏进度条 NProgress.done()
  axios.interceptors.response.use(config => {
    NProgress.done()
    return config
  })
  // 添加实例方法
  Vue.prototype.$request = axios
}

export default MyHttpServer