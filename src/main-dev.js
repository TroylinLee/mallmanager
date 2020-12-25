import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入 element-ui包的js和css
import './plugins/element.js'
// import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/css/reset.css'

// 富文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 富文本js
import VueQuillEditor from 'vue-quill-editor'

// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求根路径 本地路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 远程后台地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'

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

// 导入NProgress 包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

// 全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)

  const Y = dt.getFullYear()
  const M = (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1)
  const D = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
