<template>
	<div class="category_params">
		<my-bread leave1="商品管理" leave2="参数列表"></my-bread>
		<el-card>
			<!-- 提示信息 -->
			<el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
			</el-alert>

			<!-- 选择商品分类 -->
			<div class="cate_opt">
				<span>选择商品分类：</span>
				<el-cascader clearable v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="cateChange" :show-all-levels="false">
				</el-cascader>
			</div>

			<!-- 参数选项卡tabs -->
			<el-tabs v-model="activeTabName" @tab-click="tabClick">
        <!-- 动态参数 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 参数表格 -->
					<el-table :data="manyArr" border stripe>
            <!-- 展开列 -->
						<el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                >{{item}}</el-tag>
                <!-- 添加属性标签 -->
                <el-input
                  class="input_new_tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="btn_new_tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            
            <!-- 索引列 -->
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称">
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button 
                  type="primary" 
                  icon="el-icon-edit" 
                  size="mini" 
                  @click="showEditParam(scope.row.attr_id)">编辑
                </el-button>
								<el-button 
                  type="danger" 
                  icon="el-icon-delete" 
                  size="mini" 
                  @click="removeParam(scope.row.attr_id)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
        <!-- 静态参数 -->
				<el-tab-pane label="静态参数" name="only">
					<el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 参数表格 -->
					<el-table :data="onlyArr" border stripe>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称">
						</el-table-column>
						<el-table-column prop="attr_vals" label="属性值"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button 
                  type="primary" 
                  icon="el-icon-edit" 
                  size="mini" 
                  @click="showEditParam(scope.row.attr_id)">编辑
                </el-button>
								<el-button 
                  type="danger" 
                  icon="el-icon-delete" 
                  size="mini" 
                  @click="removeParam(scope.row.attr_id)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="formRules"
        ref="addFormRef"
        label-width="120px"
      >
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals">
          <el-input v-model="addParamsForm.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClose"
    >
      <el-form
        :model="editParamsForm"
        :rules="formRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals">
          <el-input v-model="editParamsForm.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	import MyBread from '../cuscom/MyBread'

	export default {
		name: 'CateParams',
		components: {
			MyBread
		},
		data () {
			return {
				// 级联选择器相关
				selectedCateKeys: [], // 1-3级的id列表
				cateList: [], // 商品分类列表
				cateProps: { // 配置
					expandTrigger: 'hover',
					label: 'cat_name',
					value: 'cat_id',
					children: 'children'
				},
				// 参数
				manyArr: [], // 动态参数
				onlyArr: [], // 静态参数
        activeTabName: 'many', // tabs的索引
        // 添加参数对话框相关
        addParamsForm: {
          attr_name: ''
        },
        formRules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
        },
        addDialogVisible: false,
        // 编辑对话框相关
        editDialogVisible: false,
        editParamsForm: {},
			}
    },
		created () {
			this.getCategories()
    },
    computed: {
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) return true
        return false
      },
      // 第三分类id
      getCateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 获取对话框标题
      getTitleText() {
        if (this.activeTabName === 'many') {
          return '动态属性'
        }
        return '静态属性'
      }
    },
		methods: {
      // 关闭对话框
      addFormClose() {
        this.$refs.addFormRef.resetFields()
      },
      editFormClose() {
        this.$refs.editFormRef.resetFields()
      },
      // 添加参数
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$request.post(
            `categories/${this.getCateId}/attributes`,
            {
              attr_name: this.addParamsForm.attr_name,
              attr_sel: this.activeTabName,
              attr_vals: this.addParamsForm.attr_vals
            }
          )
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.getParamsData()
        })
        
      },
      // 操作分类
      // 编辑
      async showEditParam(attrId) {
        const { data: res } = await this.$request.get(
          `categories/${this.getCateId}/attributes/${attrId}`,
          { params: { attr_sel: this.activeTabName } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editParamsForm = res.data
        this.editDialogVisible = true
      },
      async editParams() {
        const { data: res } = await this.$request.put(
          `categories/${this.getCateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeTabName,
            attr_vals: this.editParamsForm.attr_vals
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getParamsData()
      },
      // 删除
      async removeParam(attrId) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该参数, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
				if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$request.delete(
          `categories/${this.getCateId}/attributes/${attrId}`
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
      },
      // 处理标签
      // 文本框失去焦点，或者按下enter触发
      handleInputConfirm(row) {
        // 输入的内容为空时，清空
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false··1阿杂物室
        // 提交数据库，保存修改
        this.saveAttrVals(row)
      },
      // 将attr_vals保存到数据库
      async saveAttrVals(row) {
        const { data: res } = await this.$request.put(
          `categories/${this.getCateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(','),
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改参数成功！')
      },
      // 点击new tag显示输入框
      showInput(row) {
        row.inputVisible = true
        // 让输入框自动获取焦点
        // $nextTick方法的作用：当前页面元素被重新渲染之后，才会至指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 表格中的属性标签关闭时触发
      handleClose(row, index) {
        row.attr_vals.splice(index, 1)
        this.saveAttrVals(row)
      },
			// tabs切换时触发
			tabClick () {
        this.getParamsData()
      },
      // 级联选择器发生改变触发
      cateChange() {
        this.getParamsData()
      },
			async getParamsData () {
				if (this.selectedCateKeys.length === 3)
				{
					const { data: res } = await this.$request.get(
						`categories/${this.getCateId}/attributes`,
						{ params: { sel: this.activeTabName } }
					)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.trim().split(',') : []

            // 文本的显示与隐藏
            item.inputVisible = false
            // 双向绑定输入框的值
            item.inputValue = ''
          })
					if (this.activeTabName === 'many') {
            this.manyArr = res.data
          } else {
            this.onlyArr = res.data
          }
				}
			},

			// 网络请求 获取分类列表
			async getCategories () {
				const { data: res } = await this.$request.get('categories')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				// console.log(res)
				this.cateList = res.data  
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cate_opt {
		margin: 15px 0;
  }
  .el-cascader {
    width: 8%;
  }
  .el-tag {
    margin: 8px;
  }
  .input_new_tag {
    width: 90px;
  }
  .btn_new_tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>