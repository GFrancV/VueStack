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
						<option v-for="project in projectsTokens" :key="project">
							{{ project.name }}
						</option>
					</select>
				</div>
				<div class="col-sm-4 align-self-end">
					<button type="button" class="btn btn-success px-5" @click="selectProject">Select</button>
				</div>
			</div>
		</div>
	</div>
	<div class="content-dash">
		<div class="d-flex justify-content-end">
			<button type="button" class="btn btn-success">+ Create new volume</button>
		</div>
		<br />
		<div v-if="loading" class="row">
			<!-- Volume -->
			<div v-for="volume in volumes" :key="volume" class="col-sm-4">
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
					<br />
					<span class="fw-bold">Imagem bootavel: </span
					>{{ volume.volume_image_metadata.image_name }}
					<br />
					<span class="fw-bold">Created at: </span>{{ volume.created_at }}
					<br />
					<span class="fw-bold">Status: </span>
					<span v-if="volume.status == 'available'" class="label label-success">
						{{ volume.status }}</span
					>
					<span v-else-if="volume.status == 'in-use'" class="label label-info">{{
						volume.status
					}}</span>
					<span v-else class="label label-danger"> {{ volume.status }} </span>
					<br />
					<br />
					<div class="d-flex justify-content-center">
						<button type="button" class="btn btn-danger btn-sm">Delete</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="volumes.length == 0" class="d-flex justify-content-center">No volumes yet!</div>
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
		},

		data() {
			return {
				volumes: [],
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				loading: false,
			}
		},

		methods: {
			async getVolumes() {
				this.loading = true

				var token = ""

				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.currentProjectName == this.$projectsTokens[i].name)
						token = this.$projectsTokens[i].token
				}

				await this.axios
					.get("http://" + this.openStack + "/volume/v3/volumes/detail", {
						headers: {
							"x-auth-token": token,
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

			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName) {
						this.$currentProjectName = this.projectsTokens[i].name
						this.$currentProjectId = this.projectsTokens[i].id
					}
				}

				this.getVolumes()
			},
		},
		mounted() {
			this.getVolumes()
		},
		computed: {},
	}
</script>

<style>
	.volume-card {
		border: 1px solid rgb(181, 181, 181);
		border-radius: 14px;
		padding: 10px;
		margin: 12px 0px;
	}

	.label {
		border: 1px;
		border-radius: 8px;
		padding: 5px;
		color: white;
	}

	.label-success {
		background-color: #4bb543;
	}

	.label-danger {
		background-color: #f32013;
	}

	.label-info {
		background-color: #59d2f7;
	}
</style>
[ { "id": "bf37a8a6-d86d-428e-a503-118fec8f76e9", "status": "available", "size": 1,
"availability_zone": "nova", "created_at": "2022-04-08T14:09:55.000000", "updated_at":
"2022-04-08T14:09:59.000000", "name": "v2", "description": "", "volume_type": "lvmdriver-1",
"snapshot_id": null, "source_volid": null, "metadata": {}, "links": [ { "rel": "self", "href":
"http://192.168.56.102/volume/v3/volumes/bf37a8a6-d86d-428e-a503-118fec8f76e9" }, { "rel":
"bookmark", "href": "http://192.168.56.102/volume/volumes/bf37a8a6-d86d-428e-a503-118fec8f76e9" } ],
"user_id": "56b94d6cdf1e4183a58234d6e5c5f84e", "bootable": "true", "encrypted": false,
"replication_status": null, "consistencygroup_id": null, "multiattach": false, "attachments": [],
"os-vol-tenant-attr:tenant_id": "2f1d51eee0794b35b03e10ada97a614a", "volume_image_metadata": {
"image_id": "a264b1ad-3037-4bf2-9459-04d71295b8ca", "image_name": "cirros 0.4.0", "checksum":
"443b7623e27ecf03dc9e01ee93f67afe", "container_format": "bare", "disk_format": "qcow2", "min_disk":
"0", "min_ram": "0", "size": "12716032" } }, { "id": "ff13181d-51e2-4212-b714-9a0e4314e920",
"status": "available", "size": 1, "availability_zone": "nova", "created_at":
"2022-04-08T14:02:27.000000", "updated_at": "2022-04-08T14:02:40.000000", "name": "v1",
"description": "", "volume_type": "lvmdriver-1", "snapshot_id": null, "source_volid": null,
"metadata": {}, "links": [ { "rel": "self", "href":
"http://192.168.56.102/volume/v3/volumes/ff13181d-51e2-4212-b714-9a0e4314e920" }, { "rel":
"bookmark", "href": "http://192.168.56.102/volume/volumes/ff13181d-51e2-4212-b714-9a0e4314e920" } ],
"user_id": "56b94d6cdf1e4183a58234d6e5c5f84e", "bootable": "true", "encrypted": false,
"replication_status": null, "consistencygroup_id": null, "multiattach": false, "attachments": [],
"os-vol-tenant-attr:tenant_id": "2f1d51eee0794b35b03e10ada97a614a", "volume_image_metadata": {
"signature_verified": "False", "image_id": "a264b1ad-3037-4bf2-9459-04d71295b8ca", "image_name":
"cirros 0.4.0", "checksum": "443b7623e27ecf03dc9e01ee93f67afe", "container_format": "bare",
"disk_format": "qcow2", "min_disk": "0", "min_ram": "0", "size": "12716032" } } ]
