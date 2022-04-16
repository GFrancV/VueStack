<template>
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
						v-model="currentProjectName"
					>
						<option v-for="project in projectsTokens[2]" :key="project">
							{{ project }}
						</option>
					</select>
				</div>
				<div class="col-sm-4 align-self-end">
					<button type="button" class="btn btn-success px-3" @click="selectProject">Select</button>
				</div>
			</div>
		</div>
	</div>
	<br />
	<br />
	<div class="content-dash">
		<h3>Welcome to VueStack!</h3>
		<p>A simple application to manage openstack easily and quickly!</p>
	</div>
	<br />
	<h3>Summary</h3>
	<div v-if="!loading" class="row">
		<div class="col-sm-4">
			<div class="content-dash">
				<div class="row">
					<div class="col-sm-6">
						<img src="../assets/images/instances.png" alt="instance" height="125" />
					</div>
					<div class="col-sm-6 align-self-center">
						<h4>Instances:</h4>
						<p>{{ instances.length }}/10</p>
						<router-link
							class="btn btn-success btn-sm"
							:to="{
								name: 'Instances',
							}"
						>
							View
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<div class="col-sm-4">
			<div class="content-dash">
				<div class="row">
					<div class="col-sm-6">
						<img src="../assets/images/volumes.png" alt="volume" height="125" />
					</div>
					<div class="col-sm-6 align-self-center">
						<h4>Volumes:</h4>
						<p>{{ volumes.length }}/10</p>
						<router-link
							class="btn btn-success btn-sm"
							:to="{
								name: 'Volumes',
							}"
						>
							View
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<div class="col-sm-4">
			<div class="content-dash">
				<div class="row">
					<div class="col-sm-6">
						<img src="../assets/images/images.png" alt="image" height="125" />
					</div>
					<div class="col-sm-6 align-self-center">
						<h4>Images:</h4>
						<p>{{ images.length }}/10</p>
						<router-link
							class="btn btn-success btn-sm"
							:to="{
								name: 'Images',
							}"
						>
							View
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				currentToken: "",
				instances: [],
				volumes: [],
				images: [],
				loading: false,
			}
		},

		methods: {
			dashBoard() {
				setTimeout(() => {
					this.selectProject()
				}, 500)
			},

			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName)
						this.$projectsTokens[1].currentProject = this.currentProjectName
				}

				this.getCurrentToken()
				this.getInstances()
				this.getVolumes()
				this.getImages()
			},

			getCurrentToken() {
				var token = ""

				for (let i = 0; i < this.projectsTokens.length; i++) {
					if (this.currentProjectName == this.projectsTokens[i].name)
						token = this.projectsTokens[i].token
				}

				this.currentToken = token
			},

			async getInstances() {
				this.loading = true

				await this.axios
					.get("http://" + this.projectsTokens[0].ipOpenStack + "/compute/v2.1/servers/detail", {
						headers: {
							"x-auth-token": this.currentToken,
						},
					})
					.then(response => {
						this.instances = response.data.servers
					})
					.catch(error => {
						console.log(error)
						this.$toast.error("Error to obtaince the instances!")
					})
			},

			async getVolumes() {
				await this.axios
					.get("http://" + this.projectsTokens[0].ipOpenStack + "/volume/v3/volumes/detail", {
						headers: {
							"x-auth-token": this.currentToken,
						},
					})
					.then(response => {
						this.volumes = response.data.volumes
					})
					.catch(error => {
						console.log(error)
						this.$toast.error("Error to obtaince the volumes!")
					})
			},

			async getImages() {
				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2/images", {
						headers: {
							"X-Auth-Token": this.currentToken,
						},
					})
					.then(response => {
						this.images = response.data.images
						this.loading = false
					})
					.catch(error => {
						console.log(error)
						this.$toast.error("Error to obtaince the images!")
						this.loading = false
					})
			},
		},

		mounted() {
			this.dashBoard()
		},
	}
</script>

<style></style>
