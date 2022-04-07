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
				<span class="navbar-text"> Project: </span>
				<select class="form-select" name="project" id="">
					<option selected>demo</option>
					<option>xd</option>
					<option>xd1</option>
				</select>
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
						<a class="nav-link" href="#">Instances <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Volumes <span class="sr-only">(current)</span></a>
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
		<div class="col-sm-10 content bg-light">
			<div class="container">
				<div v-for="project in projects" :key="project">
					{{ project.name }}
				</div>
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
				username: "",
				openStack: "",
				token: "",
				userId: "",
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
				this.projects = projects
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

{"projects": [{"id": "2f1d51eee0794b35b03e10ada97a614a", "name": "invisible_to_admin", "domain_id":
"default", "description": "", "enabled": true, "parent_id": "default", "is_domain": false, "tags":
[], "options": {}, "links": {"self":
"http://192.168.56.102/identity/v3/projects/2f1d51eee0794b35b03e10ada97a614a"}}, {"id":
"e0bdcf5342214407b458f33d481640ae", "name": "demo", "domain_id": "default", "description": "",
"enabled": true, "parent_id": "default", "is_domain": false, "tags": [], "options": {}, "links":
{"self": "http://192.168.56.102/identity/v3/projects/e0bdcf5342214407b458f33d481640ae"}}], "links":
{"next": null, "self":
"http://192.168.56.102/identity/v3/users/56b94d6cdf1e4183a58234d6e5c5f84e/projects", "previous":
null}}
