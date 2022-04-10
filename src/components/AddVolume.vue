<template>
	<pop-form
		><h4>Create new volume</h4>
		<label class="form-label" for="volumeName">Name</label>
		<input v-model="nameVolume" class="form-control" type="text" id="volumeName" required />
		<label class="form-label" for="imageVolume">Bootable image</label>
		<select v-model="imageVolume" name="imageVolume" id="imageVolume" class="form-select">
			<option value="">Image 1</option>
			<option value="">Image 2</option>
		</select>
		<label class="form-label" for="volumeName">Size (GiB)</label>
		<input v-model="sizeVolume" class="form-control" type="number" id="volumeName" required />
		<br />
		<div class="d-grid gap-2 d-md-flex justify-content-md-end">
			<button type="button" class="btn btn-success btn-sm" @click="save">Save</button>
			<button type="button" class="btn btn-secondary btn-sm" @click="cancel">Cancel</button>
		</div>
	</pop-form>
</template>

<script>
	import PopForm from "./PopForm.vue"

	export default {
		components: { PopForm },
		data() {
			return {
				nameVolume: "",
				imageVolume: "--- Select Volume ---",
				sizeVolume: 0,
			}
		},

		methods: {
			save() {
				if (this.checkForm()) return

				console.log("llegue")
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

			cancel() {
				this.$emit("TogglePopup", false)
			},
		},
	}
</script>

<style></style>
