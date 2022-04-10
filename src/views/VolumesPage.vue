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
						<option v-for="project in projectsTokens" :key="project">
							{{ project.name }}
						</option>
					</select>
				</div>
				<div class="col-sm-4 align-self-end">
					<button type="button" class="btn btn-success px-5" @click="selectProject">Select</button>
				</div>
			</div>
		</div>
	</div>
	<div class="content-dash">
		<div class="d-flex justify-content-end">
			<button type="button" class="btn btn-success">+ Create new volume</button>
		</div>
		{{ volumes }}
		<br />
		{{ currentProjectName }}
	</div>
</template>

<script>
	export default {
		name: "VolumesPage",
		props: {
			openStack: {
				type: String,
				required: true,
			},
		},

		data() {
			return {
				volumes: {},
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				loading: false,
			}
		},

		methods: {
			async getVolumes() {
				this.loading = true

				var token = ""

				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.currentProjectName == this.$projectsTokens[i].name)
						token = this.$projectsTokens[i].token
				}

				console.log(this.$projectsTokens)
				console.log(token)

				await this.axios
					.get("http://" + this.openStack + "/volume/v3/volumes/detail", {
						headers: {
							"x-auth-token": token,
						},
					})
					.then(response => {
						this.volumes = response
						this.loadingVolumes = false
						console.log(response)
					})
					.catch(error => {
						console.log(error)
					})
			},

			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName) {
						this.$currentProjectName = this.projectsTokens[i].name
						this.$currentProjectId = this.projectsTokens[i].id
					}
				}
			},
		},
		mounted() {
			this.getVolumes()
		},
		computed: {},
	}
</script>

<style></style>
