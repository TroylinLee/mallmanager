<template>
	<div class="login_wrap">
		<el-form
			class="login_form"
			label-position="top"
			label-width="80px"
			:model="formData"
		>
			<h2>用户登录</h2>
			<el-form-item label="用户名">
				<el-input v-model="formData.username"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="formData.password"></el-input>
			</el-form-item>
			<el-button
				class="login_btn"
				type="primary"
				@click.prevent="handleLogin"
			>登录</el-button>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data () {
			return {
				formData: {
					username: '',
					password: ''
				}
			};
		},
		methods: {
			// 登录请求
			async handleLogin () {
        const res = await this.$request.post('login', this.formData)
        // console.log(res)
        const {
          data,
          meta: { msg, status }
        } = res.data

        if (status === 200) {
          // 保存token
          localStorage.setItem('token', data.token)
          
          // 登录成功，跳转home
          this.$router.push({ name: 'home' })
          // 提示成功
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login_wrap {
		background-color: #324152;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.login_form {
			background-color: #fff;
			width: 400px;
			padding: 30px;
			border-radius: 5px;
			.login_btn {
				width: 100%;
			}
		}
	}
</style>