<template>
	<div class="content-dash">{{ openStack }}s</div>
</template>

<script>
	export default {
		name: "InstancePage",
		props: {
			openStack: {
				type: String,
				required: true,
			},
		},
	}
</script>

<style></style>
