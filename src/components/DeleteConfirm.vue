<template>
	<pop-form>
		<h4>Are you sure you want to delete?</h4>
		<p>This action can not be undone</p>
		<div class="d-grid gap-2 d-md-flex justify-content-md-end">
			<button type="button" class="btn btn-danger btn-sm" @click="confirmDelete">Delete</button>
			<button type="button" class="btn btn-secondary btn-sm" @click="cancel">Cancel</button>
		</div>
	</pop-form>
</template>

<script>
	import PopForm from "./PopForm.vue"

	export default {
		components: { PopForm },

		methods: {
			confirmDelete() {
				this.$emit("TogglePopup", false, "Delete")
			},

			cancel() {
				this.$emit("TogglePopup", false, "Cancel")
			},
		},
	}
</script>

<style></style>
