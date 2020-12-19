<template>
	<div class="add_goods">
		<!-- 面包屑 -->
		<MyBread leave1="商品管理" leave2="添加商品" />

		<el-card>
			<!-- 标题 -->
			<el-alert title="添加商品信息" type="success" center show-icon :closable="false"></el-alert>
			<!-- 步骤条 -->
			<el-steps :space="200" :active="activeIndex - 0" simple finish-status="success">
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- 填写表单信息el-form tabs控制-->
			<el-form 
        :model="addGoodsForm" 
        :rules="addGoodsFormRules" 
        ref="addGoodsFormRef" 
        label-width="100px" 
        label-position="top"
      >
        <!-- el-tab-pane中的name等于activeIndex -->
				<el-tabs
          v-model="activeIndex"
          tab-position="left"
          @tab-click="tabClick"
          :before-leave="beforeTabLeave"
        >
					<el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="catChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
            <!-- 三级分类的商品参数 -->
            <el-form-item
              v-for="item in manyArr"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 参数复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyArr"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
            <el-form-item>
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
            <el-form-item>
              <el-button
                type="primary"
                @click="addGoods">点我-添加商品
              </el-button>
              <quill-editor
                v-model="addGoodsForm.goods_introduce"
              ></quill-editor>
            </el-form-item>
          </el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
	</div>
</template>

<script>
  import MyBread from '../cuscom/MyBread'
  
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  import _ from 'lodash'

	export default {
		name: 'AddGoods',
		components: {
      MyBread,
      quillEditor
		},
		data () {
			return {
				// 步骤条默认激活 与左侧tab联动
				activeIndex: '0',
				// 添加商品
				addGoodsForm: {
					goods_name: '',
					goods_price: 0,
					goods_number: 0,
					goods_weight: 0,
					goods_introduce: '', // 商品介绍
					goods_cat: [], // 商品分类，以,分割的分类列表
					pics: [], // 上传图片临时路径
					attrs: [] // 商品参数，动态和静态参数
        },
        // 添加商品表单规则，待定
				addGoodsFormRules: {
          goods_price: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
        },
        // 分类列表
        cateList: [],
        // 级联选择器配置
        cascaderProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        manyArr: [], // 动态参数
        onlyArr: [], // 静态参数
        // 图片上传
        headers: { // 头部
          Authorization: localStorage.getItem('token')
        },
			}
    },
    created() {
      this.getCategories()
    },
    computed: {
      getCateId() {
        // 当id数组长度为3，则到了三级分类
        if (this.addGoodsForm.goods_cat.length === 3) {
          return this.addGoodsForm.goods_cat[2]
        }
      }
    },
    methods: {
      // 添加商品
      async addGoods() {
        // goods_cat 分类
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        
        // pics findIndex 图片上传中的成功和移除方法
        
        // attrs:[{attr_id:?,attr_value:?}] 包含 `动态参数` 和 `静态属性`
        let manyParams = this.manyArr.map(item => {
          return { attr_id: item.attr_id, attr_value: item.attr_vals}
        })
        let onlyParams = this.onlyArr.map(item => {
          return { attr_id: item.attr_id, attr_value: item.attr_vals }
        })
        this.addGoodsForm.attrs = [...manyParams, ...onlyParams]
        form.attrs = this.addGoodsForm.attrs
        const { data: res } = await this.$request.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        
        this.$router.push('/goods')
      },
      // 图片上传的相关方法
      // file形参里面是当前操作的图片的相关信息（图片名、路径）
      handlePreview(file) {

      },
      handleRemove(file) {
        // file.response.data.tmp_path 路径
        // 移除当前x的图片 获取索引
        let index = this.addGoodsForm.pics.findIndex(item => item.pic === file.response.data.tmp_path)
        this.addGoodsForm.pics.splice(index, 1)
        // console.log(this.addGoodsForm.pics)
        // console.log('图片删除')
        // console.log(file)
      },
      handleSuccess(file) {
        // file.data.tmp_path 图片临时上传的路径
        this.addGoodsForm.pics.push({
          pic: file.data.tmp_path
        })
        // console.log('上传成功')
        // console.log(file)
      },
      // 切换tab之前绑定的事件
      beforeTabLeave(activeName, oldActiveName) {
        // 未选中商品分类阻止tab标签跳转
        // if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !==3) {
        //   this.$message.error('请先选择商品分类')
        //   return false
        // }
      },
      // 点击不同的tab触发
      async tabClick() {
        switch (this.activeIndex) {
          case '1':
            // 获取数据 sel[only,many]不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
            const { data: res } = await this.$request.get(
              `categories/${this.getCateId}/attributes`,
              { params: { sel: 'many' } }
            )
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            res.data.forEach(item => {
              item.attr_vals = 
                item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
            })
            this.manyArr = res.data
            break
          case '2':
            const { data: res1 } = await this.$request.get(
              `categories/${this.getCateId}/attributes`,
              { params: { sel: 'only' } }
            )
            if (res1.meta.status !== 200) return this.$message.error(res1.meta.msg)
            this.onlyArr = res1.data
            break

          default:
            break;
        }
      },
      // 级联选择器变化时触发change事件
      catChange() {
        if (this.addGoodsForm.goods_cat.length !==3 ) {
          this.addGoodsForm.goods_cat = []
        }
      },

      // 网络请求 获取分类列表
      async getCategories() {
        const { data: res } = await this.$request.get('categories')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // console.log(res)
        this.cateList = res.data
      }
    }
	}
</script>

<style lang="scss" scoped>
 .el-button {
   margin-bottom: 15px;
 }
</style>