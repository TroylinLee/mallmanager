<template>
	<div class="right">
		<!-- 面包屑导航 -->
		<MyBread level1="权限管理" level2="权限列表"/>

		<!-- 卡片视图 -->
		<el-card>
			<!-- 权限列表 -->
			<el-table :data="rightsList" border stripe style="width: 100%">
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="authName" label="权限名称">
				</el-table-column>
				<el-table-column prop="path" label="路径">
				</el-table-column>
				<el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level ==='1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
  import MyBread from '../cuscom/MyBread'
  
	export default {
		name: 'Right',
		data () {
			return {
				rightsList: []
			}
    },
    components: {
      MyBread
    },
		created () {
			this.getRights()
		},
		methods: {
			async getRights () {
				const { data: res } = await this.$request.get('rights/list')
				// console.log(res)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.rightsList = res.data
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>