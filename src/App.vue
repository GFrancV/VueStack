<template>
	<!-- Navbar -->
	<nav v-if="token != ''" class="navbar navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">Navbar</a>
			<form class="d-flex">
				<span class="navbar-text"> OpenStack: </span>
				<input class="form-control me-2" v-model="openStack" type="text" readonly />
				<span class="navbar-text"> User: </span>
				<input
					class="form-control me-2"
					v-model="username"
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
							:to="{ name: 'Instances' }"
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
								params: { openStack: openStack, currentProjectId: currentProjectId, token: token },
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
				<div class="row">
					<div class="col-sm-8 align-self-end">
						<h1>{{ $route.name }}</h1>
					</div>
					<div class="col-sm-4">
						<div class="row">
							<div class="col-sm-8">
								<label for="projectSelect">Project: </label>
								<select
									class="form-select"
									name="project"
									id="projectSelect"
									v-model="currentProject"
								>
									<option v-for="project in projects" :key="project">
										{{ project.name }}
									</option>
								</select>
							</div>
							<div class="col-sm-4 align-self-end">
								<button type="button" class="btn btn-success px-5" @click="selectProject">
									Select
								</button>
							</div>
						</div>
					</div>
				</div>
				<br />
				{{ currentProject }}
				{{ projectsTokens }}
				<router-view />
			</div>
		</div>
	</div>

	<div v-if="token == ''" class="container">
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
				username: "",
				openStack: "",
				token: "",
				userId: "",
				projectsTokens: [],
				currentProject: "",
				projects: {},
			}
		},

		methods: {
			getToken(token, username, userId, openStack) {
				this.token = token
				this.username = username
				this.userId = userId
				this.openStack = openStack
			},

			getProjects(projects) {
				//Get all the projects
				this.projects = projects

				//Get Scoped tojens
				for (let i = 0; i < this.projects.length; i++) {
					this.getScopedToken(projects[i].id, projects[i].name)
				}

				//Define the default project
				this.currentProjectId = this.projects[0].id
				this.currentProjectName = this.projects[0].name
			},

			async getScopedToken(idProject, nameProject) {
				await this.axios
					.post(
						"http://" + this.openStack + "/identity/v3/auth/tokens",
						{
							auth: {
								identity: {
									methods: ["password"],
									password: {
										user: {
											name: this.username,
											domain: {
												name: "Default",
											},
											password: this.password,
										},
									},
									scope: {
										project: {
											id: idProject,
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
						this.projectsTokens.push({
							name: nameProject,
							token: response.headers["x-subject-token"],
						})
					})
					.catch(error => {
						if (error.response) {
							if (error.response.status == 401)
								this.$toast.error("Failed to login! Wrong username or password")
						} else this.$toast.error("OpenStack server are unreachable!")
					})
			},

			selectProject() {
				for (let i = 0; i < this.projects.length; i++) {
					if (this.projects[i].name == this.currentProjectName)
						this.currentProjectId = this.projects[i].id
				}
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
