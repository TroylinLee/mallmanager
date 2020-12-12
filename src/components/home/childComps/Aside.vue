<template>
	<el-aside
		class="aside"
		:width="isCollapse ? '64px' : '200px'"
	>
    <div class="toggle-button" @click="toggleCollapse">|||</div>
		<el-menu
			default-active="2"
			class="el-menu-vertical-demo"
			unique-opened
			:collapse="isCollapse"
			:collapse-transition="false"
			router
			background-color="#373f41"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<el-submenu
				:index="item.id+''"
				v-for="item in menuList"
				:key="item.id"
			>
				<template slot="title">
					<i :class="icons[item.id]"></i>
					<span>{{item.authName}}</span>
				</template>
				<el-menu-item
					:index="'/'+subItem.path"
					v-for="subItem in item.children"
					:key="subItem.id"
				>
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>{{subItem.authName}}</span>
					</template>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</el-aside>
</template>

<script>
	export default {
		name: 'Aside',
		data () {
			return {
				icons: {
					'125': 'el-icon-user-solid' ,
					'103': 'el-icon-lock' ,
					'101': 'el-icon-s-goods' ,
					'102': 'el-icon-s-order' ,
					'145': 'el-icon-data-analysis' 
        },
				isCollapse: false
			}
		},
		props: {
			menuList: Array
		},
		methods: {
			toggleCollapse() {
        this.isCollapse = !this.isCollapse
      }
		}
	}
</script>

<style lang="scss" scoped>
  .el-aside {
    background-color: #373f41;
    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border: none;
    } 
	}
</style>