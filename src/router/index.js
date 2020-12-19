import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'

Vue.use(VueRouter)

const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
const Users = () => import('@/components/users/Users')
const Right = () => import('@/components/rights/Right')
const Roles = () => import('@/components/rights/Roles')
const GoodsList = () => import('@/components/goods/List')
const AddGoods = () => import('@/components/goods/AddGoods')
const CateParams = () => import('@/components/goods/CateParams')

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
    component: Home,
    children: [
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Right
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/goods',
        name: 'goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        name: 'add',
        component: AddGoods
      },
      {
        path: '/params',
        name: 'params',
        component: CateParams
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，to表示将要访问的路径，from表示当前路由配置
// next是下一步操作，next('/login') 强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const token = window.localStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!token) {
    Message.warning('请先登录')
    next('/login')
  }
  next()
})

export default router
