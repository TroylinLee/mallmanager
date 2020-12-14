<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<!-- 搜索 添加用户 -->
			<el-row :gutter="20">
				<el-col :span="6">
					<el-input
						placeholder="请输入内容"
						v-model="queryInfo.query"
						class="input-with-select"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
						></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表 -->
			<el-table
				:data="userList"
				border
				stripe
				style="width: 100%"
			>
				<el-table-column
					type="index"
					label="#"
				></el-table-column>
				<el-table-column
					prop="date"
					label="姓名"
				>
				</el-table-column>
				<el-table-column
					prop="username"
					label="姓名"
				>
				</el-table-column>
				<el-table-column
					prop="email"
					label="邮箱"
				>
				</el-table-column>
				<el-table-column
					prop="mobile"
					label="电话"
				>
				</el-table-column>
				<el-table-column
					prop="role_name"
					label="角色"
				>
				</el-table-column>
				<el-table-column label="创建日期">
					<!-- 如果单元格内显示的内容不是字符串（文本），
          需要给被显示的内容外层包裹template -->

					<!-- template内部要用数据 设置slot-scope属性
          该属性的值要用数据create_time的数据源userList -->

					<!-- slot-scope的值userList起始就是el-table绑定
          userList.row:数组中的每个对象 -->
					<template slot-scope="scope">
						{{scope.row.create_time | fmtDate}}
					</template>
				</el-table-column>
				<el-table-column label="用户状态">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.mg_state"
							active-color="#13ce66"
							inactive-color="#ff4949"
							@change="userStateChanged(scope.row)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<el-row>
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							circle
						></el-button>
						<el-button
							type="danger"
							icon="el-icon-delete"
							size="mini"
							circle
						></el-button>
						<el-tooltip
							class="item"
							effect="dark"
							content="角色分配"
							placement="top"
						>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
              >
						</el-button>
						</el-tooltip>
					</el-row>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'Users',
		data () {
			return {
				queryInfo: {
					query: '', // 查询参数
					pagenum: 1, // 当前页码
					pagesize: 5 // 每页显示条数
				},
				userList: [], // 用户数据列表
				total: 0,
				userInfo: {}
			}
		},
		filters: {
			fmtDate (value) {
				return moment(value * 1000).format('YYYY-MM-DD')
			}
		},
		created () {
			this.getUserList()
		},
		methods: {
			async getUserList () {
				const { data: res } = await this.$request.get('users', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.meta.status !== 200)
				{
					this.$message.error(res.meta.msg)
				}
				this.userList = res.data.users
				this.total = res.data.total
			},
			userStateChanged (userInfo) {

			}
		}
	}
</script>

<style lang="scss" scoped>
</style>