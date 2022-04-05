<template>
	<nav class="navbar navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand">Navbar</a>
			<form class="d-flex">
				<span class="navbar-text"> OpenStack: </span>
				<input class="form-control me-2" type="text" placeholder="10.20.139.17:4008" readonly />
				<span class="navbar-text"> User: </span>
				<input class="form-control me-2" type="text" placeholder="demo" readonly />
				<span class="navbar-text"> Project: </span>
				<input class="form-control me-2" type="text" placeholder="demo" readonly />
				<button class="btn btn-outline-success" type="submit">LogOut</button>
			</form>
		</div>
	</nav>
	<div class="row">
		<div class="col-sm-2 slidebar bg-dark navbar-dark">
			<div class="container">
				<h3 class="navbar-brand">Options</h3>
				<div class="dropdown-divider bg-white"></div>
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">Instances <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Volumes <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Images <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Flavors <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="#">Containers <span class="sr-only">(current)</span></a>
					</li>
				</ul>
			</div>
		</div>
		<div class="col-sm-10 content bg-light">
			<div class="container">
				<router-view />
			</div>
		</div>
	</div>
</template>

<style>
	@import "./assets/css/styles.css";

	.navbar-text {
		margin-right: 8px;
	}
</style>
