<template>
  <div class="category">
    <MyBread level1="商品管理" level2="商品分类"/>

    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col :span="24" class="searchArea">
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格 -->
      <tree-table
        class="tree_table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :show-row-hover="false"
        show-index
        border
      > 
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
        </template>
        <!-- 级别 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button 
            type="primary" 
            icon="el-icon-edit" 
            size="mini" 
            @click="showEditCate(scope.row)">编辑
          </el-button>
          <el-button 
            type="danger" 
            icon="el-icon-delete" 
            size="mini" 
            @click="removeCate(scope.row.cat_id)">删除
          </el-button>
        </template>
			</tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <!-- 添加分类对话框 -->
    <el-dialog
				title="添加分类"
				:visible.sync="addDialogFormVisible"
				width="50%"
				@close="addDialogClose"
			>
				<el-form
					:model="addCateForm"
					ref="addUserFormRef"
					:rules="cateFormRules"
					label-width="100px"
				>
					<el-form-item prop="cat_name" label="分类名称">
						<el-input v-model="addCateForm.cat_name"></el-input>
					</el-form-item>
					<el-form-item label="父级分类">
            <el-cascader
              :key="cascaderKey"
              clearable
              v-model="selectedKeys"
              :options="categories"
              :props="cascaderProps"
              @change="catChange">
            </el-cascader>
          </el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="addDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="addCate"
					>确 定</el-button>
				</span>
		</el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
				title="编辑分类"
				:visible.sync="editDialogFormVisible"
				width="50%"
				@close="editDialogClose"
			>
				<el-form
					:model="editCateForm"
					ref="editUserFormRef"
					:rules="cateFormRules"
					label-width="100px"
				>
					<el-form-item prop="cat_name" label="分类名称">
						<el-input v-model="editCateForm.cat_name"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="editDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="editCate"
					>确 定</el-button>
				</span>
		</el-dialog>
  </div>
</template>

<script>
  import MyBread from '../cuscom/MyBread'
  
  export default {
    name: 'Categories',
    components: {
      MyBread,
    },
    data() {
      return {
        // 获取分类
        cateList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        // 插件vue-table-with-tree-grid指定列的配置
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isOk'
          },
          {
            label: '级别',
            type: 'template',
            template: 'level'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          },
        ],
        // 添加商品相关
        addDialogFormVisible: false,
        addCateForm: {
          cat_name: '',
          cat_pid: -1,
          cat_level: -1
        },
        cateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        // 级联选择器相关
        cascaderKey: 0,
        cascaderProps: {
          expandTrigger: 'hover',
          checkStrictly: true,
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        selectedKeys: [],
        categories: [],
        // 编辑商品相关
        editDialogFormVisible: false,
        editCateForm: {
          cat_name: ''
        },
      }
    },
    created() {
      this.getSecondCatePage()
    },
    watch: {
      categories() {
        this.cascaderKey ++
      }
    },
    methods: {
      // 获取分类列表
      async getSecondCatePage() {
        const { data: res } = await this.$request.get('categories', {
          params: this.queryInfo
        })
        // console.log(res)
        if (res.meta.status !== 200) return this.$message(res.meta.msg)
        this.cateList = res.data.result
        this.total = res.data.total
      },
      async getSecondCate() {
        const { data: res } = await this.$request.get(`categories?type=2`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.categories = res.data
      },

      // 事件处理
      // 1. 操作
      // 1.1 编辑分类
      // 1.1.1. 打开对话框
      showEditCate(row) {
        this.editCateForm = row
        this.editDialogFormVisible = true
      },
      // 1.1.2. 关闭对话框
      editDialogClose() {},
      // 1.1.3. 编辑分类
      async editCate() {
        const { data: res } = await this.$request.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getSecondCatePage()
        this.editDialogFormVisible = false
      },
      // 1.2 删除分类
      async removeCate(cateId) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
        }).catch(err => err)
				if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$request.delete(`categories/${cateId}`)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getSecondCatePage()
      },
      // 2. 分页
      handleSizeChange (val) {
				// console.log(`每页 ${val} 条`);
				this.queryInfo.pagesize = val
				// this.queryInfo.pagenum = 1
				this.getSecondCatePage()
			},
			handleCurrentChange (val) {
				// console.log(`当前页: ${val}`);
				this.queryInfo.pagenum = val
				this.getSecondCatePage()
      },
      // 3. 添加商品相关
      // 3.1打开对话框
      showAddCate() {
        this.getSecondCate()
        this.addDialogFormVisible = true
      },
      // 3.2 关闭对话框
      addDialogClose() {
        this.selectedKeys = []
      },
      // 3.3 级联选择器发生改变触发
      catChange() {
        
      },
      // 3.4 添加分类
      async addCate() {
        // 如果selectedKeys 数组长度>0，说明选中父级分类
        if (this.selectedKeys.length > 0) {
          // 当前分类的id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          // 当前分类等级
          this.addCateForm.cat_level = this.selectedKeys.length
        } else {
          // 父级分类的id
          this.addCateForm.cat_pid = 0
          // 父级分类等级
          this.addCateForm.cat_level = 0
        }
        const { data: res } = await this.$request.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        console.log(res)
        this.$message.success(res.meta.msg)
        this.getSecondCatePage()
        this.addDialogFormVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tree_table {
    margin-top: 20px;
    font-size: 15px;
  }
</style>