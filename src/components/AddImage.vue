<template>
	<pop-form>
		<h4>Upload new image</h4>
		<label class="form-label" for="imageName">Name</label>
		<input v-model="imageName" class="form-control" type="text" id="imageName" required />
		<br />
		<label class="form-label" for="imageFormat">Format</label>
		<select v-model="imageFormat" class="form-select" name="imageFormat" id="imageFormat">
			<option v-for="format in formats" :key="format">{{ format }}</option>
		</select>
		<br />
		<label class="form-label" for="imageFile">Image file input</label>
		<input type="file" class="form-control" id="imageFile" />
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
				formats: [
					"ami",
					"ari",
					"aki",
					"vhd",
					"vhdx",
					"vmdk",
					"raw",
					"qcow2",
					"vdi",
					"ploop",
					"iso",
				],
				imageName: "",
				imageFormat: "--- Select Format ---",
				loading: false,
			}
		},

		methods: {
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

				this.sendData()
			},

			checkForm() {
				var error = false

				if (this.imageName == "") {
					this.$toast.error("Name of the image is required!")
					error = true
				}
				if (this.imageFormat == "--- Select Format ---") {
					this.$toast.error("The format of the image is required!")
					error = true
				}

				return error
			},

			sendData() {
				this.loading = true

				this.axios
					.post(
						"http://" + this.$projectsTokens[0].ipOpenStack + "/image/v2/images",
						{
							disk_format: this.imageFormat,
							name: this.imageName,
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
							"Image " + JSON.stringify(response.data.name) + " created successfully!"
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
