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
				<el-table-column
					prop="create_date"
					label="创建日期"
				></el-table-column>
				<el-table-column label="用户状态"></el-table-column>
				<el-table-column label="操作"></el-table-column>
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
        this.userList.map(item => {
          return item.create_date = moment(item.create_time * 1000).format('YYYY-MM-DD')
        })
				this.total = res.data.total
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>