import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，to表示将要访问的路径，from表示从哪里来
// next是下一步操作，next('/login') 强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const token = window.localStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!token) return next('/login')
  next()
})

export default router
