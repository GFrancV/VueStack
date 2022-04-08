<template>
	<div class="content-dash">
		<div class="d-flex justify-content-end">
			<button type="button" class="btn btn-success">+ Create new volume</button>
		</div>
		{{ token }}
		{{ volumes }}
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
			currentProjectId: {
				type: String,
				required: true,
			},
			token: {
				type: String,
				required: true,
			},
		},

		data() {
			return {
				volumes: {},
				loading: false,
			}
		},

		methods: {
			async getVolumes() {
				this.loading = true

				await this.axios
					.get("http://" + this.openStack + "/volume/v3/" + this.currentProjectId, {
						headers: {
							"x-auth-token": this.token,
						},
					})
					.then(response => {
						this.volumes = response.data.volumes
						this.loadingVolumes = false
					})
			},
		},
		mounted() {
			this.getVolumes()
		},
	}
</script>

<style></style>
