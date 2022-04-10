<template>
	<!-- Navbar -->
	<nav v-if="Object.keys(projects).length != 0" class="navbar navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">Navbar</a>
			<form class="d-flex">
				<span class="navbar-text"> OpenStack: </span>
				<input class="form-control me-2" v-model="credentials.openStack" type="text" readonly />
				<span class="navbar-text"> User: </span>
				<input
					class="form-control me-2"
					v-model="credentials.username"
					type="text"
					placeholder="demo"
					readonly
				/>
				<button class="btn btn-outline-success" type="submit">LogOut</button>
			</form>
		</div>
	</nav>

	<!-- SlideBar -->
	<div v-if="Object.keys(projects).length != 0" class="row">
		<div class="col-sm-2 slidebar bg-dark navbar-dark">
			<div class="container">
				<h3 class="navbar-brand">Options</h3>
				<div class="dropdown-divider bg-white"></div>
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<router-link
							class="nav-link"
							:class="{ active: $route.name === 'Instances' }"
							:to="{ name: 'Instances', params: { openStack: credentials.openStack } }"
						>
							Instances
						</router-link>
					</li>
					<li class="nav-item active">
						<router-link
							class="nav-link"
							:class="{ active: $route.name === 'Volumes' }"
							:to="{
								name: 'Volumes',
								params: {
									openStack: credentials.openStack,
								},
							}"
						>
							Volumes
						</router-link>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Images <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Flavors <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Containers <span class="sr-only">(current)</span></a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Dashboard -->
		<div class="col-sm-10 content bg-light">
			<div class="container">
				<router-view />
			</div>
		</div>
	</div>
	<div v-if="Object.keys(projects).length == 0" class="container">
		<sign-in @getToken="getToken" @getProjects="getProjects"></sign-in>
	</div>
</template>

<script>
	import SignIn from "./views/SignIn.vue"

	export default {
		components: { SignIn },
		name: "RootComponent",
		data() {
			return {
				credentials: {},
				projects: {},
			}
		},

		methods: {
			getToken(credentials) {
				this.credentials = credentials

				this.$ipOpenStack = credentials.openStack
			},

			getProjects(projects) {
				//Get all the projects
				this.projects = projects

				//Get Scoped tojens
				for (let i = 0; i < projects.length; i++) {
					this.getScopedToken(projects[i].id, projects[i].name)
				}
			},

			async getScopedToken(idProject, nameProject) {
				await this.axios
					.post(
						"http://" + this.credentials.openStack + "/identity/v3/auth/tokens",
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
								},
								scope: {
									project: {
										id: idProject,
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
						this.$projectsTokens.push({
							name: nameProject,
							token: response.headers["x-subject-token"],
						})
					})
					.catch(error => {
						if (error.response) {
							if (error.response.status == 400) this.$toast.error("Internal server error!")
						} else this.$toast.error("Error to obtaince the scoped token!")
					})
			},
		},

		mounted() {},
	}
</script>

<style>
	@import "./assets/css/styles.css";

	.navbar-text {
		margin-right: 8px;
	}
</style>
