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
					<button type="button" class="btn btn-success px-3" @click="selectProject">Select</button>
				</div>
			</div>
		</div>
	</div>
	<br />
	<div class="content-dash">
		<div class="d-flex bd-highlight">
			<div class="p-2 w-100 bd-highlight align-self-center">
				<h3>{{ instances.length }}/10 instances</h3>
			</div>
			<div class="p-2 flex-shrink-1 bd-highlight">
				<button @click="showPopForm" type="button" class="btn btn-success">
					+ Create new instance
				</button>
			</div>
		</div>
		<br />

		<div v-if="loading" class="row">
			<h3>Loading...</h3>
		</div>
		<div v-else-if="instances.length == 0" class="d-flex justify-content-center">
			<h3>No instances yet!</h3>
		</div>
		<div v-else class="row">
			<!-- Instance -->
			<div v-for="instance in instances" :key="instance" class="col-sm-4 volume-card-colection">
				<div class="volume-card">
					<div class="d-flex justify-content-center">
						<img src="../assets/images/instances.png" alt="instances" width="140" />
					</div>
					<br />
					<span class="fw-bold">Name: </span>{{ instance.name }}
					<br />
					<span class="fw-bold">Created at: </span>{{ getDate(instance.created) }}
					<br />
					<span class="fw-bold">Addresses: </span>
					<span v-if="instance.length == 0">{{ instance.addresses }}</span>
					<span v-else>----</span>
					<br />
					<span class="fw-bold">Status: </span>
					<span v-if="instance.status == 'ACTIVE'" class="label label-success"> Active</span>
					<span v-else-if="instance.status == 'in-use'" class="label label-info">{{
						instance.status
					}}</span>
					<span v-else-if="instance.status == 'BUILD'" class="label label-warning">Building</span>
					<span v-else class="label label-danger"> {{ instance.status }} </span>

					<br />
					<br />
					<div class="d-flex justify-content-center">
						<button @click="popDelete(instance)" type="button" class="btn btn-danger btn-sm">
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<add-instance
		v-if="popForm"
		@TogglePopup="TogglePopup"
		:token="currentToken"
		:project="currentProjectName"
	></add-instance>
	<delete-confirm v-if="confirmDelete" @TogglePopup="TogglePopup"> </delete-confirm>
</template>

<script>
	import AddInstance from "../components/AddInstance.vue"
	import DeleteConfirm from "../components/DeleteConfirm.vue"

	export default {
		components: { AddInstance, DeleteConfirm },
		name: "InstancePage",
		data() {
			return {
				instances: [],
				projectsTokens: this.$projectsTokens,
				currentProjectName: "invisible_to_admin",
				loading: false,
				popForm: false,
				confirmDelete: false,
				currentToken: "",
				instanceToDelete: {},
			}
		},

		methods: {
			selectProject() {
				for (let i = 0; i < this.$projectsTokens.length; i++) {
					if (this.$projectsTokens[i].name == this.currentProjectName)
						this.$projectsTokens[1].currentProject = this.currentProjectName
				}

				this.getInstances()
			},

			getDate(instance) {
				var date = new Date(instance)
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

			async getInstances() {
				this.loading = true

				this.getCurrentToken()

				await this.axios
					.get("http://" + this.projectsTokens[0].ipOpenStack + "/compute/v2.1/servers/detail", {
						headers: {
							"x-auth-token": this.currentToken,
						},
					})
					.then(response => {
						this.instances = response.data.servers
						this.loading = false
					})
					.catch(error => {
						console.log(error)
						this.loading = false
					})
			},

			showPopForm() {
				this.popForm = true
			},

			TogglePopup(status, type) {
				this.confirmDelete = status
				this.popForm = status

				if (type == "Confirm") {
					this.getInstances()
					setTimeout(() => {
						this.getInstances()
					}, 5000)
				}

				if (type == "Delete") {
					this.deleteInstance()
					setTimeout(() => {
						this.getInstances()
					}, 5000)
				}

				if (type == "Cancel") this.instanceToDelete = {}
			},

			popDelete(instance) {
				this.instanceToDelete = instance
				this.confirmDelete = true
			},

			async deleteInstance() {
				this.$toast.info("Deleting the instance...")

				this.getCurrentToken()

				await this.axios
					.delete(
						"http://" +
							this.projectsTokens[0].ipOpenStack +
							"/compute/v2.1/servers/" +
							this.instanceToDelete.id,
						{
							headers: {
								"x-auth-token": this.currentToken,
							},
						}
					)
					.then(response => {
						if (response) this.$toast.success("Instance erased successfully!")
					})
					.catch(error => {
						if (!error.response) this.$toast.error("Unexpected error!")
					})

				this.getInstances()
			},
		},
		mounted() {
			this.selectProject()
		},
		computed: {},
	}
</script>

<style></style>
