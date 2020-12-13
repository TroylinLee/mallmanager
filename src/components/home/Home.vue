<template>
	<el-container class="home_container">
		<el-header class="header">
      <div>
        <img src="@/assets/image/logo.png" alt="无法显示图片">
        <h3>电商后台管理系统</h3>
      </div>
      <el-button @click="loginOut" type="info">退出</el-button>
		</el-header>
		<el-container>
      <Aside :menu-list="menuList"/>
			
			<el-main class="main">Main</el-main>
		</el-container>
	</el-container>
</template>

<script>
  import Aside from './childComps/Aside'
	export default {
    name: 'Home',
    components: {
      Aside
    },
    data() {
      return {
        menuList: []
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      // 网络请求数据
      async getMenuList() {
        const res = await this.$request.get('menus')
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.menuList = res.data.data
        // console.log(res)
      },
      // 事件处理
      loginOut() {
        // 清除token
        localStorage.clear()
        // 提示退出成功
        this.$message.success('退出成功')
        // 跳转login页面
        this.$router.push('/login')
      }
    }
	}
</script>

<style lang="scss" scoped>
	.home_container {
		height: 100%;
		.header {
      background-color: #373f41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      &>div {
        display: flex;
        align-items: center;
        img {
          height: 40px;
        }
        h3 {
          margin-left: 15px;
        }
      }
      .middle {
        text-align: center;
      }
    }
    .el-container {
      height: 100%;
    }
		.main {
			background-color: #eaedf1;
		}
	}
</style>