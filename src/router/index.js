import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/login/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/home/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/home/Welcome')

const Users = () => import(/* webpackChunkName: "Users_Right_Roles" */ '@/components/users/Users')
const Right = () => import(/* webpackChunkName: "Users_Right_Roles" */ '@/components/rights/Right')
const Roles = () => import(/* webpackChunkName: "Users_Right_Roles" */ '@/components/rights/Roles')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_AddGoods" */ '@/components/goods/List')
const AddGoods = () => import(/* webpackChunkName: "GoodsList_AddGoods" */ '@/components/goods/AddGoods')

const CateParams = () => import(/* webpackChunkName: "CateParams_Categories" */ '@/components/goods/CateParams')
const Categories = () => import(/* webpackChunkName: "CateParams_Categories" */ '@/components/goods/Categories')

const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '@/components/order/Orders')
const Report = () => import(/* webpackChunkName: "Orders_Report" */ '@/components/report/Report')

Vue.use(VueRouter)

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
    redirect: '/Welcome',
    children: [
      {
        path: '/home',
        name: 'welcome',
        component: Welcome
      },
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
      {
        path: '/categories',
        name: 'categories',
        component: Categories
      },
      {
        path: '/orders',
        name: 'orders',
        component: Orders
      },
      {
        path: '/reports',
        name: 'reports',
        component: Report
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
