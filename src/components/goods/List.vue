<template>
	<div class="goods_list">
		<!-- 面包屑 -->
		<MyBread leave1="商品管理" leave2="商品列表" />

		<!-- 卡片区域 -->
		<el-card>
			<!-- 搜索模块 -->
			<el-row :gutter="20">
				<el-col :span="6">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" @input="getGoodsList" clearable @clear="getGoodsList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddPage">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- 商品列表 -->
			<el-table :data="goodsList" border stripe>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="goods_name" label="商品名称">
				</el-table-column>
				<el-table-column prop="goods_price" label="商品价格(元)" width="100px">
				</el-table-column>
				<el-table-column prop="goods_weight" label="商品重量" width="70px">
				</el-table-column>
				<el-table-column prop="goods_number" label="商品数量" width="70px">
				</el-table-column>
				<el-table-column label="创建时间" width="140px">
					<template slot-scope="scope">
						{{scope.row.add_time | fmtDate}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showeditGoodss(scope.row)">
            </el-button>
						<el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)">
						</el-button>
					</template>
				</el-table-column>
			</el-table>
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

      <!-- 编辑弹框 -->
      <el-dialog
				title="编辑商品"
				:visible.sync="editDialogFormVisible"
				width="50%"
				@close="editDialogClose"
			>
				<el-form
					:model="editGoodsForm"
					ref="addUserFormRef"
					:rules="editGoodsFormRules"
					label-width="70px"
				>
					<el-form-item prop="goods_name" label="商品名称">
						<el-input
							v-model="editGoodsForm.goods_name"
						></el-input>
					</el-form-item>
					<el-form-item
						prop="goods_price"
						label="商品价格"
					>
						<el-input v-model="editGoodsForm.goods_price"></el-input>
					</el-form-item>
					<el-form-item
						prop="goods_number"
						label="商品数量"
					>
						<el-input v-model="editGoodsForm.goods_number"></el-input>
					</el-form-item>
          <el-form-item
						prop="goods_weight"
						label="商品重量"
					>
						<el-input v-model="editGoodsForm.goods_weight"></el-input>
					</el-form-item>
          <el-form-item
						prop="goods_introduce"
						label="商品介绍"
					>
						<el-input v-model="editGoodsForm.goods_introduce"></el-input>
					</el-form-item>
          <el-form-item
						prop="pics"
						label="上传图片"
					>
						<el-input v-model="editGoodsForm.pics"></el-input>
					</el-form-item>
          <el-form-item
						prop="attrs"
						label="商品参数"
					>
						<el-input v-model="editGoodsForm.attrs"></el-input>
					</el-form-item>
				</el-form>
				<span
					slot="footer"
					class="dialog-footer"
				>
					<el-button @click="editDialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						@click="editGoodss"
					>确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
  import MyBread from '../cuscom/MyBread'
  import moment from 'moment'

	export default {
		name: 'List',
		components: {
			MyBread
		},
		data () {
      var checkPrice = (rule, value, callback) => {
				if (!value || value === '' || value === null)
				{
					return callback(new Error('不能为空'))
				}
				setTimeout(() => {
					if (!isNaN(value) && value >= 0.01)
					{
						callback()
					} else
					{
						callback(new Error('价格至少为0.01'))
					}
				}, 100)
      }
      let checkNumber = (rule, value, callback) => {
				if (!value)
				{
					return callback(new Error('不能为空'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value))
					{
            callback(new Error('请输入整数'))
					} else if (value <= 0){
            callback(new Error('数量必须大于0'))
          } else {
            callback()
          }
				}, 100)
			}
			return {
				// 获取商品列表
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
        total: 0,
        // 编辑商品
        editDialogFormVisible: false,
        editGoodsForm: {},
        goodsId: -1,
        editGoodsFormRules: {
          goods_price: [
            { required: false, message: '请输入商品价格', trigger: 'blur' },
            { validator: checkPrice, trigger: 'blur'}
          ],
          goods_number: [
            { required: false, message: '请输入商品数量', trigger: 'blur' },
            { validator: checkNumber, trigger: 'blur'}
          ]
        }
			}
		},
		created () {
			this.getGoodsList()
		},
		filters: {
			fmtDate (value) {
				return moment(value * 1000).format("YYYY-MM-DD hh:mm:ss")
			}
		},
		methods: {
      // 事件处理
      // 4. 编辑商品
      async editGoodss() {
        const { data: res } = await this.$request.put(
          `goods/${this.goodsId}`, this.editGoodsForm
        )
        console.log(res)
        this.editDialogFormVisible = false
      },
      editDialogClose() {
        this.editGoodsForm = {}
      },
      async showeditGoodss(goods) {
        const { data: res } = await this.$request.get(`goods/${goods.goods_id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsId = goods.goods_id
        this.editGoodsForm = goods
        this.editDialogFormVisible = true
      },
      // 3. 分页
      handleSizeChange (val) {
				// console.log(`每页 ${val} 条`);
				this.queryInfo.pagesize = val
				// this.queryInfo.pagenum = 1
				this.getGoodsList()
			},
			handleCurrentChange (val) {
				// console.log(`当前页: ${val}`);
				this.queryInfo.pagenum = val
				this.getGoodsList()
			},
      // 2. 删除商品
      async removeGoods(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				// console.log(confirmResult)
				// 点击确定 返回为：confirm
				// 点解取消 返回为：cancel
				if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$request.delete(`goods/${id}`)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      },
			// 1. 添加商品跳转编辑页面
			goAddPage () {
        this.$router.push('/goods/add')
      },

			// 网络请求 获取商品列表
			async getGoodsList () {
				const { data: res } = await this.$request.get('goods', {
					params: this.queryInfo
        })
        // console.log(res)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsList = res.data.goods
        this.total = res.data.total
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>