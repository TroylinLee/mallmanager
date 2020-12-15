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
						@input="getUserList"
						clearable
						@clear="getUserList"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="getUserList"
						></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button
						type="primary"
						@click="AddDialogFormVisible = true"
					>添加用户</el-button>
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
					<template slot-scope="scope">
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							circle
							@click="showEditUser(scope.row.id)"
						></el-button>
						<el-button
							type="danger"
							icon="el-icon-delete"
							size="mini"
							circle
							@click="showDelUserMsgBox(scope.row.id)"
						>
						</el-button>
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
								@click="showSetUserRole(scope.row)"
							>
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[1, 2, 4, 6, 8]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>

			<!-- 对话框 -->
			<!-- 添加用户 -->
			<el-dialog
				title="添加用户"
				:visible.sync="AddDialogFormVisible"
				width="50%"
				@close="addDialogClose"
			>
				<el-form
					:model="addUserForm"
					ref="addUserFormRef"
					:rules="addUserFormRules"
					label-width="100px"
				>
					<el-form-item
						prop="username"
						label="用户名"
					>
						<el-input v-model="addUserForm.username"></el-input>
					</el-form-item>
					<el-form-item
						prop="password"
						label="密码"
					>
						<el-input v-model="addUserForm.password"></el-input>
					</el-form-item>
					<el-form-item
						prop="email"
						label="邮箱"
					>
						<el-input v-model="addUserForm.email"></el-input>
					</el-form-item>
					<el-form-item
						prop="mobile"
						label="手机"
					>
						<el-input v-model="addUserForm.mobile"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="AddDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="addUser"
					>确 定</el-button>
				</span>
			</el-dialog>
			<!-- 编辑用户信息 -->
			<el-dialog
				title="编辑用户"
				:visible.sync="editDialogFormVisible"
				width="50%"
				@close="editDialogClose"
			>
				<el-form
					:model="editUserForm"
					ref="addUserFormRef"
					:rules="editUserFormRules"
					label-width="70px"
				>
					<el-form-item label="用户名">
						<el-input
							disabled
							v-model="editUserForm.username"
						></el-input>
					</el-form-item>
					<el-form-item
						prop="email"
						label="邮箱"
					>
						<el-input v-model="editUserForm.email"></el-input>
					</el-form-item>
					<el-form-item
						prop="mobile"
						label="手机"
					>
						<el-input v-model="editUserForm.mobile"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="editDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="editUser"
					>确 定</el-button>
				</span>
			</el-dialog>
			<!-- 角色分配 -->
			<el-dialog
				title="分配角色"
				:visible.sync="roleDialogFormVisible"
        width="50%"
        @close="setRoleDialogClose"
			>
				<el-form :model="userInfo">
					<el-form-item label="当前用户">{{userInfo.username}}</el-form-item>
					<el-form-item label="当前角色">{{userInfo.role_name}}</el-form-item>
					<el-form-item
						label="分配角色"
					>
						<el-select
							v-model="selectRoleId"
							placeholder="请选择角色"
              filterable
              allow-create
              default-first-option
						>
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="roleDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="setUserRole"
					>确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'Users',
		data () {
			// 自定义邮箱规则
			var checkEmail = (rule, value, callback) => {
				const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				if (!value)
				{
					return callback(new Error('邮箱不能为空'))
				}
				setTimeout(() => {
					if (mailReg.test(value))
					{
						callback()
					} else
					{
						callback(new Error('请输入正确的邮箱格式'))
					}
				}, 100)
			}

			// 自定义手机号规则
			let checkMobile = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (!value)
				{
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {
					// Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
					// 所以我就在前面加了一个+实现隐式转换

					if (!Number.isInteger(+value))
					{
						callback(new Error('请输入数字值'))
					} else
					{
						if (phoneReg.test(value))
						{
							callback()
						} else
						{
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			}
			return {
				queryInfo: {
					query: '', // 查询参数
					pagenum: 1, // 当前页码
					pagesize: 4 // 每页显示条数
				},
				userList: [], // 用户数据列表
				total: 0,
				userInfo: {},
				AddDialogFormVisible: false,
				addUserForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				// 添加用户表单验证规则
				addUserFormRules: {
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
						{
							min: 2,
							max: 10,
							message: '用户名的长度在2~10个字',
							trigger: 'blur'
						}
					],
					password: [
						{ required: true, message: '请输入用户密码', trigger: 'blur' },
						{
							min: 6,
							max: 18,
							message: '用户密码的长度在6~18个字',
							trigger: 'blur'
						}
					],
					email: [
						{ required: false, message: '请输入邮箱', trigger: 'blur' },
						{ validator: checkEmail, trigger: 'blur' }
					],
					mobile: [
						{ required: false, message: '请输入手机号码', trigger: 'blur' },
						{ validator: checkMobile, trigger: 'blur' }
					],
				},
				// 编辑用户
				editDialogFormVisible: false,
				editUserForm: {},
				editUserFormRules: {
					email: [
						{ required: false, message: '请输入邮箱', trigger: 'blur' },
						{ validator: checkEmail, trigger: 'blur' }
					],
					mobile: [
						{ required: false, message: '请输入手机号码', trigger: 'blur' },
						{ validator: checkMobile, trigger: 'blur' }
					]
        },
        // 分配角色
        roleDialogFormVisible: false,
        userInfo: {}, // 用户信息
        roleList: [], // 所有用户列表
        selectRoleId: '' // 选中角色的ID
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
			// 网络请求
			async getUserList () {
				const { data: res } = await this.$request.get('users', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.meta.status !== 200)
				{
					this.$message.error(res.meta.msg)
				}
				this.userList = res.data.users
				this.total = res.data.total
			},

			// 事件处理
			// 1. 状态管理
			async userStateChanged (userInfo) {
				const { data: res } = await this.$request.put(
					`users/${userInfo.id}/state/${userInfo.mg_state}`
				)
				if (res.meta.status !== 200)
				{
					userInfo.mg_state = !userInfo.mg_state
					return this.$message.error(res.meta.msg)
				}
				this.$message.success(res.meta.msg)
			},
			// 2. 分页
			handleSizeChange (val) {
				// console.log(`每页 ${val} 条`);
				this.queryInfo.pagesize = val
				this.queryInfo.pagenum = 1
				this.getUserList()
			},
			handleCurrentChange (val) {
				// console.log(`当前页: ${val}`);
				this.queryInfo.pagenum = val
				this.getUserList()
			},
			// 3. 监听 添加用户对话框的关闭事件
			addDialogClose () {
				// el-form 组件中的方法
				this.$refs.addUserFormRef.resetFields()
			},
			// 4. 添加用户
			async addUser () {
				// this.addUserForm.mobile *= 1 // 把手机号码转换为数字 
				const { data: res } = await this.$request.post('users', this.addUserForm)
				console.log(res)
				if (res.meta.status === 201)
				{
					this.$message.success(res.meta.msg)
					// 隐藏用户对话框
					this.AddDialogFormVisible = false
					this.getUserList()
				} else
				{
					this.$message.warning(res.meta.msg)
				}
				// 提交请求前，表单与验证
				// this.$refs.addUserFormRef.validate(async valid => {
				//   // console.log(valid)
				//   // 表单校验失败
				//   if (!valid) return
				// })
			},
			// 5. 删除用户提示框
			async showDelUserMsgBox (id) {
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				console.log(confirmResult)
				// 点击确定 返回为：confirm
				// 点解取消 返回为：cancel
				if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
				// 发送删除的请求：用户id
				// 1. data中找userId
				// 2. 把userId以参数形式传进来
				const { data: res } = await this.$request.delete(`users/${id}`)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.$message.success(res.meta.msg)
				this.getUserList()
			},
			// 6. 编辑用户
			async showEditUser (id) {
				// 如果是本地数据模拟，此处参数可以是userList；
				// 若是网络请求，有可能发生网络延迟，则需要请求服务器的res.data
				const { data: res } = await this.$request.get(`users/${id}`)
				if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
				this.editUserForm = res.data
				this.editDialogFormVisible = true
			},
			editDialogClose () { // 点击空白处关闭窗口
				this.$refs.addUserFormRef.resetFields()
			},
			async editUser () { // 按下确定发送修改请求
				const { data: res } = await this.$request.put(
					`users/${this.editUserForm.id}`,
					{
						email: this.editUserForm.email,
						mobile: this.editUserForm.mobile,
					}
				)
				if (res.meta.status !== 200)
				{
					this.$message.error('更新用户信息失败')
				}
				this.editDialogFormVisible = false
				this.$message.success('更新用户信息成功')
				this.getUserList()
			},
			// 7. 分配角色
			async showSetUserRole (user) {
        this.userInfo = user
        const { data: res } = await this.$request.get('roles')
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.roleList = res.data

        const { data: res1 } = await this.$request.get(`users/${user.id}`)
        // console.log(res1)
        this.selectRoleId = res1.data.rid
        this.roleDialogFormVisible = true
      },
      setRoleDialogClose() {
        // this.selectRoleId = ''
        // this.userInfo = {}
      },
      async setUserRole() {
        if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
        const { data: res } = await this.$request.put(
          `users/${this.userInfo.id}/role`,
          { rid: this.selectRoleId }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.roleDialogFormVisible = false
      }
		}
	}
</script>

<style lang="scss" scoped>
</style>