<template>
	<div class="roles_wrap">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮 -->
			<el-row>
				<el-button type="primary" @click="addDialogFormVisible = true">添加角色</el-button>
			</el-row>
			<!-- 角色列表 -->
			<el-table :data="rolesList" border stripe style="width: 100%">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="roleName" label="角色名称">
				</el-table-column>
				<el-table-column prop="roleDesc" label="角色描述">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDia(scope.row.id)"
            >编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelRoleMsgBox(scope.row.id)">删除</el-button>
						<el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDia(scope.row)">分配权限
            </el-button>
					</template>
				</el-table-column>
			</el-table>
      
      <!-- 对话框 -->
      <!-- 添加角色 -->
      <el-dialog
				title="添加角色"
				:visible.sync="addDialogFormVisible"
				width="40%"
				@close="addRoleDialogClose"
			>
				<el-form
					:model="addRoleForm"
					ref="addRoleFormRef"
					:rules="RoleFormRules"
					label-width="100px"
				>
					<el-form-item
						prop="roleName"
						label="角色名称"
					>
						<el-input v-model="addRoleForm.roleName"></el-input>
					</el-form-item>
					<el-form-item
						prop="roleDesc"
						label="角色描述"
					>
						<el-input v-model="addRoleForm.roleDesc"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="addDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="addRole"
					>确 定</el-button>
				</span>
			</el-dialog>
      <!-- 编辑角色 -->
      <el-dialog
				title="编辑角色"
				:visible.sync="editDialogFormVisible"
				width="40%"
				@close="editRoleDialogClose"
			>
				<el-form
					:model="editRoleForm"
					ref="editRoleFormRef"
					:rules="RoleFormRules"
					label-width="100px"
				>
					<el-form-item
						prop="roleName"
						label="角色名称"
					>
						<el-input v-model="editRoleForm.roleName"></el-input>
					</el-form-item>
					<el-form-item
						prop="roleDesc"
						label="角色描述"
					>
						<el-input v-model="editRoleForm.roleDesc"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="editDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="editRole"
					>确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'Roles',
		data () {
			return {
        rolesList: [],
        // 添加用户
        addDialogFormVisible: false,
        addRoleForm: {},
        RoleFormRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          roleDesc: [
            { required: false, message: '请输入角色描述', trigger: 'blur'}
          ]
        },
        // 编辑用户
        editDialogFormVisible: false,
        editRoleForm: {},
			}
		},
		created () {
			this.getRoles()
		},
		methods: {
      // 3. 删除角色
      async showDelRoleMsgBox(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该角色，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
				const { data: res } = await this.$request.delete(`roles/${id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRoles()
      },
      // 2. 编辑角色
      async showEditRoleDia(id) { // 显示窗口
				const { data: res } = await this.$request.get(`roles/${id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoleForm = res.data
        this.editDialogFormVisible = true
      },
      editRoleDialogClose() { // 关闭窗口
        this.$refs.editRoleFormRef.resetFields()
      },
      async editRole() {
				const { data: res } = await this.$request.put(
          `roles/${this.editRoleForm.roleId}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('角色编辑成功')
        this.editDialogFormVisible = false
        this.getRoles()
      },
      // 1. 添加角色
      addRoleDialogClose() { // 点击空白处关闭窗口
        this.$refs.addRoleFormRef.resetFields()
      },
      async addRole() { // 添加角色
        const { data: res } = await this.$request.post('roles', this.addRoleForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('角色创建成功')
        this.addDialogFormVisible = false
        this.getRoles()
      },
      // 网络请求
			async getRoles () { // 请求角色列表
				const { data: res } = await this.$request.get('roles')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.rolesList = res.data
      },
      
      // 分配权限
      showSetRightDia() {}
		}
	}
</script>

<style lang="scss" scoped>
</style>