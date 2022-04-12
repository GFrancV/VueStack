<template>
	<pop-form>
		<h4>Upload new image</h4>
		{{ image }}
		<label class="form-label" for="imageFile">Image file input</label>
		<input @change="preview" type="file" class="form-control" id="imageFile" />
		<br />
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
		},

		data() {
			return {
				image: {},
				loading: false,
			}
		},

		methods: {
			preview(event) {
				var file = event.target.files
				var formatFile = {
					name: file.file,
				}
				var formData = new FormData()
				formData.append("image", file.type)
				formData.append("name", "xd")
				console.log(file)
				console.log(formatFile)
				//console.log(event.target.files)
				console.log(formData)
			},

			async getImages() {
				await this.axios
					.get("http://" + this.$projectsTokens[0].ipOpenStack + "/compute/v2/images", {
						headers: {
							"X-Auth-Token": this.token,
							"Content-Type": "application/json",
						},
					})
					.then(response => {
						this.images = response.data.images
					})
			},

			save() {
				if (this.checkForm()) return

				this.getImageId()

				this.sendData()
			},

			checkForm() {
				var error = false

				if (this.nameVolume == "") {
					this.$toast.error("Name of the volume is required!")
					error = true
				}
				if (this.imageVolume == "--- Select Volume ---") {
					this.$toast.error("The image of the volume is required!")
					error = true
				}
				if (this.sizeVolume == 0) {
					this.$toast.error("The size of the volume must be greater than 0!")
					error = true
				}

				return error
			},

			getImageId() {
				var idImage = ""

				for (let i = 0; i < this.images.length; i++)
					if (this.images[i].name == this.imageVolume) idImage = this.images[i].id

				return idImage
			},

			sendData() {
				this.loading = true

				this.axios
					.post(
						"http://" + this.$projectsTokens[0].ipOpenStack + "/volume/v3/volumes",
						{
							volume: {
								size: this.sizeVolume,
								availability_zone: null,
								source_volid: null,
								description: null,
								multiattach: false,
								snapshot_id: null,
								backup_id: null,
								name: this.nameVolume,
								imageRef: this.getImageId(),
								volume_type: null,
								metadata: {},
								consistencygroup_id: null,
							},
							"OS-SCH-HNT:scheduler_hints": {
								same_host: [
									"a0cf03a5-d921-4877-bb5c-86d26cf818e1",
									"8c19174f-4220-44f0-824a-cd1eeef10287",
								],
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
						this.$toast.success(
							"Volume " + JSON.stringify(response.data.volume.name) + " created successfully!"
						)
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
		},

		computed: {
			msgBtn() {
				if (this.loading) return "Submitting..."
				else return "Submit"
			},
		},
	}
</script>

<style></style>
