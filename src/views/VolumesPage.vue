<template>
	<div class="content-dash">
		<div class="d-flex justify-content-end">
			<button type="button" class="btn btn-success">+ Create new volume</button>
		</div>

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

				await this.axis
					.get(
						"http://" + this.openStack + "/volume/v3/" + this.currentProjectId + "/volumes/detail",
						{
							headers: {
								"x-auth-token": this.user.token,
							},
						}
					)
					.then(response => {
						this.volumes = response.data.volumes
						this.loadingVolumes = false
					})
			},
		},
	}
</script>

<style></style>
