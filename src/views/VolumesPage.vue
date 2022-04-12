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
		<div class="d-flex bd-highlight">
			<div class="p-2 w-100 bd-highlight align-self-center">
				<h3>{{ volumes.length }}/10 volumes</h3>
			</div>
			<div class="p-2 flex-shrink-1 bd-highlight">
				<button @click="showPopForm" type="button" class="btn btn-success">
					+ Create new volume
				</button>
			</div>
		</div>
		<br />

		<div v-if="loading" class="row">
			<!-- Volume -->
			<div v-if="volumes.length == 0" class="d-flex justify-content-center">
				<h3>No volumes yet!</h3>
			</div>
			<div v-for="volume in volumes" :key="volume" class="col-sm-4 volume-card-colection">
				<div class="volume-card">
					<div class="d-flex justify-content-center">
						<img src="../assets/images/volumes.png" alt="volumes" width="140" />
					</div>
					<br />
					<span class="fw-bold">Name: </span>{{ volume.name }}
					<br />
					<span class="fw-bold">Bootable: </span> <span v-if="volume.bootable"> Yes</span>
					<span v-else>No</span>
					<br />
					<span class="fw-bold">Size: </span>{{ volume.size }} GB
					<span v-if="volume.volume_image_metadata">
						<br />
						<span class="fw-bold">Imagem bootavel: </span
						>{{ volume.volume_image_metadata.image_name }}
					</span>
					<br />
					<span class="fw-bold">Created at: </span>
					{{ getDate(volume.created_at) }}
					<br />
					<span class="fw-bold">Status: </span>
					<span v-if="volume.status == 'available'" class="label label-success">
						{{ volume.status }}</span
					>
					<span v-else-if="volume.status == 'in-use'" class="label label-info">{{
						volume.status
					}}</span>
					<span v-else-if="volume.status == 'creating'" class="label label-warning">{{
						volume.status
					}}</span>
					<span v-else class="label label-danger"> {{ volume.status }} </span>
					<br />
					<br />
					<div class="d-flex justify-content-center">
						<button @click="popDelete(volume)" type="button" class="btn btn-danger btn-sm">
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="loaing" class="d-flex justify-content-center"><h3>Loading...</h3></div>
	</div>
	<add-volume v-if="popForm" @TogglePopup="TogglePopup" :token="currentToken"></add-volume>
	<delete-confirm v-if="confirmDelete" @TogglePopup="TogglePopup"> </delete-confirm>
</template>

<script>
	import AddVolume from "../components/AddVolume.vue"
	import DeleteConfirm from "../components/DeleteConfirm.vue"

	export default {
		components: { AddVolume, DeleteConfirm },
		name: "VolumesPage",
		props: {
			openStack: {
				type: String,
				required: true,
			},
		},

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

<style>
	.volume-card-colection {
		display: flex;
	}
	.volume-card {
		border: 1px solid rgb(181, 181, 181);
		border-radius: 14px;
		padding: 10px;
		margin: 12px 0px;
		width: 500px;
	}

	.modal {
		width: 300px;
		padding: 30px;
		box-sizing: border-box;
		background-color: #fff;
		font-size: 20px;
		text-align: center;
	}
</style>
