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
	<div class="content-dash">
		<div class="d-flex justify-content-end">
			<button @click="showPopForm" type="button" class="btn btn-success">+ Add new image</button>
		</div>
		<br />
		<!-- Images -->
		<div v-if="loading" class="row">
			<div v-if="images.length == 0" class="d-flex justify-content-center">
				<h3>No images yet!</h3>
			</div>
			<div v-for="image in images" :key="image" class="col-sm-4 volume-card-colection">
				<div class="volume-card">
					<div class="d-flex justify-content-center">
						<img src="../assets/images/images.png" alt="images" width="140" />
					</div>
					<br />
					<span class="fw-bold">Name: </span>{{ image.name }}
					<br />
					<span class="fw-bold">Created: </span>{{ getDate(image.created) }}
					<br />
					<span class="fw-bold">Status: </span>
					<span v-if="image.status == 'ACTIVE'" class="label label-success"> Active</span>
					<span v-else-if="image.status == 'in-use'" class="label label-info">{{
						image.status
					}}</span>
					<span v-else-if="image.status == 'creating'" class="label label-warning">{{
						image.status
					}}</span>
					<span v-else class="label label-danger"> {{ image.status }} </span>
					<br />
					<br />
					<div class="d-flex justify-content-center">
						<button @click="popDelete(image)" type="button" class="btn btn-danger btn-sm">
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="d-flex justify-content-center"><h3>Loading...</h3></div>
	</div>
	<add-image v-if="popForm" @TogglePopup="TogglePopup" :token="currentToken"></add-image>
</template>

<script>
	import AddImage from "../components/AddImage.vue"

	export default {
		components: { AddImage },
		name: "ImagesPage",
		data() {
			return {
				images: [],
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				loading: false,
				popForm: false,
				confirmDelete: false,
				currentToken: "",
				imageToDelete: {},
			}
		},

		methods: {
			getCurrentToken() {
				var token = ""

				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.currentProjectName == this.$projectsTokens[i].name)
						token = this.$projectsTokens[i].token
				}

				this.currentToken = token
			},

			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName)
						this.$projectsTokens[1].currentProject = this.currentProjectName
				}

				this.getImages()
			},

			async getImages() {
				this.loading = true
				var images = {}

				this.getCurrentToken()

				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2/images", {
						headers: {
							"X-Auth-Token": this.currentToken,
						},
					})
					.then(response => {
						images = response.data.images
					})
					.catch(error => {
						if (!error.response) this.$toast.error("Unexpected error!")
					})

				this.getImagesInfo(images)
			},

			async getImagesInfo(images) {
				for (let i = 0; i < images.length; i++) {
					await this.axios
						.get(
							"http://" +
								this.$projectsTokens[0].ipOpenStack +
								"/compute/v2/images/" +
								images[i].id,
							{
								headers: {
									"X-Auth-Token": this.currentToken,
								},
							}
						)
						.then(response => {
							this.images.push(response.data.image)
						})
				}
			},

			getDate(image) {
				var date = new Date(image)
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

			showPopForm() {
				this.popForm = true
			},

			TogglePopup(status, type) {
				this.confirmDelete = status
				this.popForm = status

				if (type == "Confirm") {
					this.getImages()
					setTimeout(() => {
						this.getImages()
					}, 5000)
				}

				if (type == "Delete") {
					this.deleteVolume()
					setTimeout(() => {
						this.getVolumes()
					}, 5000)
				}

				if (type == "Cancel") this.imageToDelete = {}
			},
		},

		mounted() {
			this.selectProject()
		},
	}
</script>

<style></style>
