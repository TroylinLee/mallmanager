<template>
	<div class="order_wrap">
		<!-- 面包屑 -->
		<MyBread level1="订单管理" level2="订单列表" />

		<!-- 卡片区域 -->
		<el-card>
			<!-- 搜索栏 -->
			<el-row :gutter="20">
				<el-col :span="6">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" @input="getOrders" clearable @clear="getOrders">
						<el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<!-- 用户列表 -->
			<el-table :data="ordersList" border stripe style="width: 100%">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="order_number" label="订单编号">
				</el-table-column>
				<el-table-column prop="order_price" label="订单价格">
				</el-table-column>
				<el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="danger" size="mini" v-else>已付款</el-tag>
          </template>
				</el-table-column>
				<el-table-column prop="is_send" label="是否发货">
				</el-table-column>
				<el-table-column label="下单时间">
					<template slot-scope="scope">
						{{scope.row.create_time | fmtDate}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
          <el-button 
            type="primary" 
            icon="el-icon-edit" 
            size="mini" 
            circle 
            @click="editDialogFormVisible = true"
          ></el-button>
          <el-button 
            type="success" 
            icon="el-icon-location" 
            size="mini"
            circle
            @click="showOrderLocation"
          ></el-button>
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
        :total="total">
			</el-pagination>
		</el-card>
    <!-- 对话框弹窗 -->
    <!-- 编辑收货地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogFormVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editAddressForm"
        ref="AddressFormRef"
        :rules="editAddressFormRules"
        label-width="100px"
      >
        <el-form-item prop="address1" label="省市区/县">
          <el-cascader
            clearable
            v-model="editAddressForm.address1"
            :options="cityData"
            :props="cascaderProps">
          </el-cascader>
        </el-form-item>
        <el-form-item
          prop="address2"
          label="详细地址"
        >
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editAddress"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流信息 -->
    <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
	</div>
</template>

<script>
	import MyBread from '../cuscom/MyBread'
  import cityData from './citydata'
  import moment from 'moment'

	export default {
		name: 'Orders',
		components: {
			MyBread
		},
		data () {
			return {
				// 获取订单列表
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				total: 0,
        ordersList: [], // 限定一页数量的订单列表
        // 修改地址相关
        editDialogFormVisible: false,
        editAddressForm: {
          address1: [],
          address2: ''
        },
        editAddressFormRules: {
          address1: [
            { required: true, message: '请选择省市区县', trigger: 'blur'}
          ],
          address2: [
            { required: true, message: '请输入详细地址', trigger: 'blur'}
          ]
        },
        // 省市区县级联选择器
        cityData,
        cascaderProps: {
          expandTrigger: 'hover',
        },
        // 物流信息
        progressDialogVisible: false,
        progressInfo: []
			}
		},
		created () {
			this.getOrders()
    },
    filters: {
      fmtDate(v) {
        return moment(v * 1000).format('YYYY-MM-DD hh:mm:ss')
      }
    },
		methods: {
			// 请求订单列表
			async getOrders () {
				const { data: res } = await this.$request.get('orders', {
					params: this.queryInfo
				})
				// console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
        this.total = res.data.total
        this.ordersList = res.data.goods
      },
      
      // 1. 分页
			handleSizeChange (val) {
				// console.log(`每页 ${val} 条`);
				this.queryInfo.pagesize = val
				this.getOrders()
			},
			handleCurrentChange (val) {
				// console.log(`当前页: ${val}`);
				this.queryInfo.pagenum = val
				this.getOrders()
			},
      // 2. 编辑订单-修改地址
      // 2.1 关闭对话框
      editDialogClose() {
        this.$refs.AddressFormRef.resetFields()
      },
      // 2.2 修改收货地址
      editAddress() {
        this.$message.success('修改地址成功!')
        this.editDialogFormVisible = false
      },
      // 3. 显示物流信息
      async showOrderLocation() {
        // 供测试的物流单号：1106975712662
        const { data: res } = await this.$request.get(`/kuaidi/1106975712662`)
        if (res.meta.status !== 200) return this.$message.error('获取物流进度失败')
        console.log(res)
        this.progressInfo = res.data
        this.progressDialogVisible = true
      },
		}
	}
</script>

<style lang="scss" scoped>
  .el-cascader {
    width: 100%;
  }
</style>