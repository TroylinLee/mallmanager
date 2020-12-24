<template>
	<div class="roles_wrap">
	  <!-- 面包屑导航 -->
    <MyBread level1="权限管理" level2="角色列表"/>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮 -->
			<el-row>
				<el-button type="primary" @click="addDialogFormVisible = true">添加角色</el-button>
			</el-row>
			<!-- 角色列表 -->
			<el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRight(scope.row, item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 无权限的显示 -->
            <div class="empty_data">
              <span v-if="scope.row.children.length === 0">未分配权限</span>
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
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
      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="RightDialogClose"
      >
        <el-tree
          :data="rightsList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="rightTreeRef"
          :props="treeProps"
          :default-checked-keys="defKeys"
        ></el-tree>
        <span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="setRightDialogVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="allotRights"
					>确 定</el-button>
				</span>
      </el-dialog>
		</el-card>
	</div>
</template>

<script>
  import MyBread from '../cuscom/MyBread'

	export default {
    name: 'Roles',
    components: {
      MyBread
    },
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
        // 分配权限
        setRightDialogVisible: false,
        rightsList: [], // 权限列表
        treeProps: { // 树形控件的属性绑定对象
          label: 'authName',
          children: 'children'
        },
        // 默认选中节点的id列表
        defKeys: [],
        // 当前分配权限的id
        roleId : -1
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
        // console.log(res)
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
      // 4. 分配权限
      async showSetRightDia(role) {
        this.roleId = role.id
        // console.log(this.roleId)
        // 获取角色权限列表
        const { data: res } = await this.$request.get('rights/tree')
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsList = res.data // 保存权限树
        this.getLeafKeys(role, this.defKeys)
        // console.log(this.defKeys)
        this.setRightDialogVisible = true
      },
      // 通过递归，获取角色下三级权限的id，并保存到defKeys数组
      getLeafKeys(node, arr) {
        // 没有children属性，为三级节点
        if (!node.children) return arr.push(node.id)
        node.children.forEach(item => this.getLeafKeys(item, arr));
      },
      RightDialogClose() {
        this.defKeys = []
      },
      async allotRights() {
        const keys = [
          ...this.$refs.rightTreeRef.getCheckedKeys(),
          ...this.$refs.rightTreeRef.getHalfCheckedKeys(),
        ]
        // console.log(this.roleId)
        // join()方法用于把数组中的所有元素中插入字符串，然后整体转换为字符串格式
        const { data: res } = await this.$request.post(
          `roles/${this.roleId}/rights`,
          { rids: keys.join(',') }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('权限分配成功')
        this.getRoles()
        this.setRightDialogVisible = false
      },
      async removeRight(role, rightId) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该权限，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.$message.info('已取消删除权限')
        }
				const { data: res } = await this.$request.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        role.children = res.data
      },
		}
	}
</script>

<style lang="scss" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
  .empty_data {
    min-height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      line-height: 60px;
      width: 50%;
      color: #909399;
    }
  }
</style>