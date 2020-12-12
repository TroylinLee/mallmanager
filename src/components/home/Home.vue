<template>
	<el-container class="home_container">
		<el-header class="header">
      <div>
        <img src="@/assets/image/logo.png" alt="无法显示图片">
        <h3>电商后台管理系统</h3>
      </div>
      <el-button class="loginout" type="info">退出</el-button>
		</el-header>
		<el-container>
			<el-aside
				class="aside"
				width="200px"
			>Aside</el-aside>
			<el-main class="main">Main</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		name: 'Home',
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
      .loginout {

      }
		}
		.aside {
			background-color: #d3dce6;
		}
		.main {
			background-color: #eaedf1;
		}
	}
</style>