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
					<button type="button" class="btn btn-success px-5" @click="selectProject">Select</button>
				</div>
			</div>
		</div>
	</div>
	<br />
	<div class="content-dash"></div>
</template>

<script>
	export default {
		data() {
			return {
				volumes: [],
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				loading: false,
				popForm: false,
				confirmDelete: false,
				currentToken: "",
				volumeToDelete: {},
			}
		},
		methods: {
			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName)
						this.$projectsTokens[1].currentProject = this.currentProjectName
				}

				this.getVolumes()
			},

			getDate(volume) {
				var date = new Date(volume)
				var formatData =
					date.getDay() +
					"-" +
					date.getUTCMonth() +
					"-" +
					date.getFullYear() +
					" at " +
					date.getUTCHours() +
					":" +
					(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())

				return formatData
			},

			getCurrentToken() {
				var token = ""

				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.currentProjectName == this.$projectsTokens[i].name)
						token = this.$projectsTokens[i].token
				}

				this.currentToken = token
			},

			async getVolumes() {
				this.loading = true

				this.getCurrentToken()

				await this.axios
					.get("http://" + this.openStack + "/volume/v3/volumes/detail", {
						headers: {
							"x-auth-token": this.currentToken,
						},
					})
					.then(response => {
						this.volumes = response.data.volumes
						this.loadingVolumes = false
					})
					.catch(error => {
						console.log(error)
					})
			},

			showPopForm() {
				this.popForm = true
			},

			TogglePopup(status, type) {
				this.confirmDelete = status
				this.popForm = status

				if (type == "Confirm") {
					this.getVolumes()
					setTimeout(() => {
						this.getVolumes()
					}, 5000)
				}

				if (type == "Delete") {
					this.deleteVolume()
					setTimeout(() => {
						this.getVolumes()
					}, 5000)
				}

				if (type == "Cancel") this.volumeToDelete = {}
			},

			popDelete(volume) {
				this.volumeToDelete = volume
				this.confirmDelete = true
			},

			async deleteVolume() {
				this.$toast.info("Deleting the volume...")

				this.getCurrentToken()

				await this.axios
					.delete("http://" + this.openStack + "/volume/v3/volumes/" + this.volumeToDelete.id, {
						headers: {
							"x-auth-token": this.currentToken,
						},
					})
					.then(response => {
						if (response) this.$toast.success("volume erased successfully!")
					})
					.catch(error => {
						if (!error.response) this.$toast.error("Unexpected error!")
					})

				this.getVolumes()
			},
		},
		mounted() {
			this.selectProject()
		},
		computed: {},
	}
</script>

<style></style>
