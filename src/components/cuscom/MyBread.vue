<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
		<el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
	export default {
    name: 'MyBread',
    props: {
      level1: String,
      level2: String
    }
	}
</script>

<style lang="scss" scoped>
</style>