<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>{{leave1}}</el-breadcrumb-item>
		<el-breadcrumb-item>{{leave2}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
	export default {
    name: 'MyBread',
    props: {
      leave1: String,
      leave2: String
    }
	}
</script>

<style lang="scss" scoped>
</style>