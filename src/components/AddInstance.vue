<template>
	<pop-form>
		<div class="d-flex bd-highlight">
			<div class="p-2 w-100 bd-highlight align-self-center"><h4>Create new instance</h4></div>
			<div class="p-2 flex-shrink-1 bd-highlight">
				<label class="form-label" for="instanceName">Project</label>
				<input
					v-model="currentProject"
					class="form-control"
					type="text"
					id="instanceName"
					readonly
				/>
			</div>
		</div>

		<label class="form-label" for="instanceName">Name</label>
		<input v-model="instanceName" class="form-control" type="text" id="instanceName" required />
		<br />
		<label class="form-label" for="descInstance">Description</label>
		<textarea
			v-model="descInstance"
			class="form-control"
			name="descInstance"
			id="descInstance"
			rows="3"
		></textarea>
		<br />
		<div v-if="!volumeInInstance" class="row">
			<div class="col-sm-7">
				<label class="form-label" for="imageInstance">Image</label>
				<select v-model="imageInstance" name="imageInstance" id="imageInstance" class="form-select">
					<option v-for="image in images" :key="image">{{ image.name }}</option>
				</select>
			</div>
			<div class="col-sm-5">
				<label class="form-label" for="flavorInstance">Flavor</label>
				<select
					v-model="flavorInstance"
					name="flavorInstance"
					id="flavorInstance"
					class="form-select"
				>
					<option v-for="flavor in flavors" :key="flavor">{{ flavor.name }}</option>
				</select>
			</div>
		</div>
		<div v-else>
			<label class="form-label" for="voumeInstance">Volumes</label>
			<select v-model="voumeInstance" class="form-select" name="voumeInstance" id="voumeInstance">
				<option v-for="volume in volumes" :key="volume">{{ volume.name }}</option>
			</select>
		</div>
		<div class="form-check">
			<input
				v-model="volumeInInstance"
				class="form-check-input"
				type="checkbox"
				id="volumeInInstance"
				value="true"
			/>
			<label class="form-check-label" for="volumeInInstance">Use a created volume</label>
		</div>
		<br />
		<label class="form-label" for="flavorInstance">Network</label>
		<div v-for="network in networks" :key="network" class="form-check">
			<input
				v-model="networkInstance"
				class="form-check-input"
				type="checkbox"
				:id="network.label"
				:value="network.label"
			/>
			<label class="form-check-label" :for="network.label">{{ network.label }}</label>
		</div>
		<div class="d-grid gap-2 d-md-flex justify-content-md-end">
			<button
				:disabled="loading == true ? true : false"
				type="button"
				class="btn btn-success btn-sm"
				@click="save"
			>
				{{ msgBtn }}
			</button>
			<button type="button" class="btn btn-secondary btn-sm" @click="cancel">Cancel</button>
		</div>
	</pop-form>
</template>

<script>
	import PopForm from "./PopForm.vue"

	export default {
		components: { PopForm },
		props: {
			token: {
				type: String,
				required: true,
			},
			project: {
				type: String,
				required: true,
			},
		},

		data() {
			return {
				currentProject: this.project,
				instanceName: "",
				descInstance: "",
				imageInstance: "--- Select Image ---",
				flavorInstance: "--- Select Flavor ---",
				voumeInstance: "--- Select Volume ---",
				volumeInInstance: false,
				networkInstance: [],
				images: [],
				flavors: [],
				volumes: [],
				networks: [],
				loading: false,
			}
		},

		methods: {
			async getImages() {
				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2/images", {
						headers: {
							"X-Auth-Token": this.token,
						},
					})
					.then(response => {
						this.images = response.data.images
					})
			},

			async getFlavors() {
				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2.1/flavors", {
						headers: {
							"X-Auth-Token": this.token,
						},
					})
					.then(response => {
						this.flavors = response.data.flavors
					})
			},

			async getVolumes() {
				var allVolumes = []
				var availableVolumes = []

				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/volume/v3/volumes/detail", {
						headers: {
							"x-auth-token": this.token,
						},
					})
					.then(response => {
						allVolumes = response.data.volumes
					})

				for (let i = 0; i < allVolumes.length; i++) {
					if (allVolumes[i].status != "reserved" && allVolumes[i].bootable == "true") {
						availableVolumes.push(allVolumes[i])
					}
				}

				console.log(allVolumes)

				this.volumes = availableVolumes
			},

			async getNetworks() {
				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2.1/os-networks", {
						headers: {
							"X-Auth-Token": this.token,
						},
					})
					.then(response => {
						this.networks = response.data.networks
					})
			},

			save() {
				if (this.checkForm()) return
				this.sendData()
			},

			checkForm() {
				var error = false

				if (this.instanceName == "") {
					this.$toast.error("Name of the instance is required!")
					error = true
				}
				if (this.descInstance == "") {
					this.$toast.error("Description of the instance is required!")
					error = true
				}
				if (this.imageInstance == "--- Select Image ---") {
					this.$toast.error("The image of the instance is required!")
					error = true
				}
				if (this.flavorInstance == "--- Select Flavor ---") {
					this.$toast.error("The flavor of the instance is required!")
					error = true
				}

				return error
			},

			getImageId() {
				var idImage = ""

				for (let i = 0; i < this.images.length; i++)
					if (this.images[i].name == this.imageInstance) idImage = this.images[i].id

				return idImage
			},

			getFlavorId() {
				var idFlavor = ""

				for (let i = 0; i < this.flavors.length; i++)
					if (this.flavors[i].name == this.flavorInstance) idFlavor = this.flavors[i].id

				return idFlavor
			},

			getArrayNetworks() {
				var arrayNetworks = []

				for (let i = 0; i < this.networkInstance.length; i++) {
					for (let j = 0; j < this.networks.length; j++) {
						if (this.networks[j].label == this.networkInstance[i]) {
							var aux = {
								uuid: this.networks[j].id,
							}

							arrayNetworks.push(aux)
						}
					}
				}

				return arrayNetworks
			},

			sendData() {
				this.loading = true

				this.axios
					.post(
						"http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2.1/servers",
						{
							server: {
								name: this.instanceName,
								//description: this.descInstance,
								imageRef: this.getImageId(),
								flavorRef: this.getFlavorId(),
								networks: this.getArrayNetworks(),
							},
						},
						{
							headers: {
								"X-Auth-Token": this.token,
								"Content-Type": "application/json",
							},
						}
					)
					.then(response => {
						if (response.status == 202) this.$toast.success("Instance created successfully!")

						this.$emit("TogglePopup", false, "Confirm")
						this.loading = false
					})
					.catch(error => {
						if (error.response) {
							if (error.response.status == 413) this.$toast.error("Request Entity Too Large!")
						}
						this.loading = false
					})
			},

			cancel() {
				this.$emit("TogglePopup", false, "Cancel")
			},
		},

		mounted() {
			this.getImages()
			this.getFlavors()
			this.getVolumes()
			this.getNetworks()
		},

		computed: {
			msgBtn() {
				if (this.loading) return "Creating..."
				else return "Create"
			},
		},
	}
</script>

<style></style>
