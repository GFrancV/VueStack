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
			<button
				:disabled="loading == true ? true : false"
				type="button"
				class="btn btn-primary px-5"
				@click="checkForm"
			>
				{{ msgBtn }}
			</button>
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
				token: "",
				loading: false,
				openstack: "",
				userId: "",
				projects: {},
			}
		},

		methods: {
			checkForm() {
				var ipValid = this.checkIp()

				if (Object.keys(this.credentials.ip).length < 4)
					this.$toast.error("Ip of server is required!")
				if (!ipValid) this.$toast.error("Invalid Ip!")
				if (this.credentials.port == "") this.$toast.error("Port of server is required!")
				if (this.credentials.username == "") this.$toast.error("Username is required!")
				if (this.credentials.password == "") this.$toast.error("Password is required!")
				if (
					this.credentials.password != "" &&
					this.credentials.username != "" &&
					ipValid &&
					Object.keys(this.credentials.ip).length == 4
				)
					this.login()
			},

			checkIp() {
				var error = false

				for (let i = 0; i < Object.keys(this.credentials.ip).length; i++) {
					if (this.credentials.ip[i] > 255 || this.credentials.ip[i] < 0) error = true

					this.openstack += this.credentials.ip[i]
					if (i <= 2) this.openstack += "."
				}

				this.openstack += ":" + this.credentials.port

				return !error
			},

			async login() {
				this.loading = true

				await this.axios
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
						this.loading = false
						this.token = response.headers["x-subject-token"]
						this.userId = response.data.token.user.id
						this.getProjects()
						this.$emit(
							"getToken",
							this.token,
							this.credentials.username,
							this.userId,
							this.openstack
						)
						this.$toast.success("SignIn successful!")
					})
					.catch(error => {
						if (error.response) {
							if (error.response.status == 401)
								this.$toast.error("Failed to login! Wrong username or password")
						} else this.$toast.error("OpenStack server are unreachable!")

						this.loading = false
					})

				this.loading = false
			},

			async getProjects() {
				await this.axios
					.get(
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
							"/identity/v3/users/" +
							this.userId +
							"/projects",
						{
							headers: { "x-auth-token": this.token },
						}
					)
					.then(response => {
						this.projects = response.data.projects
						this.$emit("getProjects", this.projects)
					})
					.catch(response => {
						var error_message = "Somethign went wrong..."
						if (response == "Error: Request failed with status code 401") {
							error_message = "Invalid credentials..."
						}
						this.$toasted.error(error_message, {
							theme: "outline",
							position: "top-right",
							duration: 5000,
						})
						this.loadingProjects = false
					})
			},
		},
		computed: {
			msgBtn() {
				if (this.loading) return "Connecting to server..."
				else return "Sign In"
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
