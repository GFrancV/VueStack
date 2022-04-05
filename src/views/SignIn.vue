<template>
	<div class="container signin">
		<h1>Sign In</h1>
		<div class="form-sign">
			<div class="row">
				<div class="col-sm-8">
					<label class="form-label" for="ipServer">OpenStack Server</label>
					<input v-model="credentials.ip" class="form-control" type="text" id="ipServer" required />
				</div>
				<div class="col-sm-4">
					<label class="form-label" for="portServer">Port</label>
					<input
						v-model="credentials.port"
						class="form-control"
						type="number"
						id="portServer"
						required
					/>
				</div>
			</div>
			<label class="form-label" for="username">User</label>
			<input v-model="credentials.username" class="form-control" type="text" required />
			<label class="form-label" for="password">Password</label>
			<input
				v-model="credentials.password"
				class="form-control"
				type="password"
				id="password"
				required
			/>
			<br />
			<button type="button" class="btn btn-primary px-5" @click="checkForm">Login</button>
		</div>
	</div>
	<div v-if="errors" class="container">
		{{ credentials }}
	</div>
</template>

<script>
	export default {
		name: "SignIn",
		data() {
			return {
				credentials: {
					ip: "",
					port: "",
					username: "",
					password: "",
				},
				errors: null,
			}
		},
		methods: {
			checkForm() {
				if (this.credentials.ip == "") this.$toast.error("Ip of server is required!")
				if (this.credentials.port == "") this.$toast.error("Port of server is required!")
				if (this.credentials.username == "") this.$toast.error("Username is required!")
				if (this.credentials.password == "") this.$toast.error("Password is required!")
				if (this.credentials.password != "" && this.credentials.username != "") this.errors = true //this.login()
			},
		},
	}
</script>

<style>
	.signin {
		width: 500px;
	}

	.form-sign {
		padding: 15px;
		border: 2px solid grey;
		border-radius: 15px;
	}
</style>
