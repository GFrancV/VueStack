<template>
	<div class="container signin">
		<h1>Sign In</h1>
		<div class="form-sign">
			<label class="form-label" for="ipServer">OpenStack Server</label>
			<div class="row">
				<div class="col-sm-2">
					<input
						v-model="credentials.ip[0]"
						class="form-control"
						type="number"
						min="0"
						max="255"
						required
					/>
				</div>
				.
				<div class="col-sm-2">
					<input
						v-model="credentials.ip[1]"
						class="form-control"
						type="number"
						min="0"
						max="255"
						required
					/>
				</div>
				.
				<div class="col-sm-2">
					<input
						v-model="credentials.ip[2]"
						class="form-control"
						type="number"
						min="0"
						max="255"
						required
					/>
				</div>
				.
				<div class="col-sm-2">
					<input
						v-model="credentials.ip[3]"
						class="form-control"
						type="number"
						min="0"
						max="255"
						required
					/>
				</div>
				:
				<div class="col-sm-3">
					<input v-model="credentials.port" class="form-control" type="number" required />
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
</template>

<script>
	export default {
		name: "SignIn",
		data() {
			return {
				credentials: {
					ip: {},
					port: 80,
					username: "",
					password: "",
				},
				openstack: "",
				errors: null,
				message: {
					auth: {
						identity: {
							methods: ["password"],
							password: {
								user: {
									name: "demo",
									domain: {
										name: "Default",
									},
									password: "devstack",
								},
							},
						},
					},
				},
			}
		},
		methods: {
			checkForm() {
				//if (this.credentials.ip == "") this.$toast.error("Ip of server is required!")
				//if (this.credentials.port == "") this.$toast.error("Port of server is required!")
				if (this.credentials.username == "") this.$toast.error("Username is required!")
				if (this.credentials.password == "") this.$toast.error("Password is required!")
				if (this.credentials.password != "" && this.credentials.username != "") this.login()
			},

			login() {
				this.axios
					.post(
						"http://" +
							this.credentials.ip[0] +
							"." +
							this.credentials.ip[1] +
							"." +
							this.credentials.ip[2] +
							"." +
							this.credentials.ip[3] +
							":" +
							this.credentials.port +
							"/identity/v3/auth/tokens",
						{
							auth: {
								identity: {
									methods: ["password"],
									password: {
										user: {
											name: this.credentials.username,
											domain: {
												name: "Default",
											},
											password: this.credentials.password,
										},
									},
									scope: {
										project: {
											id: "default",
										},
									},
								},
							},
						},
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
					.then(response => {
						this.user = response.data.token.user
						this.user.token = response.headers["x-subject-token"]
						this.user.scope = "project"
						//this.getProjects()
						this.loading = false
						this.$toast.success("SignIn successful!")
						console.log(response)
					})
					.catch(error => {
						if (error.response.status == 401)
							this.$toast.error("Failed to login! Wrong username or password")
						this.loading = false
					})
			},
		},
	}
</script>

<style>
	.signin {
		width: 600px;
	}

	.form-sign {
		padding: 15px;
		border: 2px solid grey;
		border-radius: 15px;
	}
</style>
