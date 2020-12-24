<template>
	<div class="report_wrap">
		<!-- 面包屑 -->
		<MyBread level1="数据统计" level2="数据报表" />

		<el-card>
			<div id="main"></div>
		</el-card>
	</div>
</template>

<script>
	import MyBread from '../cuscom/MyBread'
	import echarts from 'echarts'
	import _ from 'lodash'

	export default {
		name: 'Report',
		components: {
			MyBread
		},
		data () {
			return {
				// 需要合并的数据
				options: {
					title: {
						text: '用户来源'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								background: '#e9eef3'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: 'true'
					},
					xAxis: [
						{ boundaryGap: false }
					],
					yAxis: [
						{ type: 'value' }
					]
				}
			}
		},
		async mounted () {
			let myChart = echarts.init(document.getElementById('main'))
			const { data: res } = await this.$request.get('reports/type/1')
			if (res.meta.status !== 200) return this.$message.error('获取折线图数据失败')
			// 数据合并
			const result = _.merge(res.data, this.options)
			// 展示数据
			myChart.setOption(result)
		}
	}
</script>

<style lang="scss" scoped>
	#main {
		width: 750px;
		height: 400px;
	}
</style>