import { createRouter, createWebHashHistory } from "vue-router"
import DashboarMain from "../views/DashboardMain.vue"
import SignIn from "../views/SignIn.vue"
import Instances from "../views/InstancesPage.vue"
import Volumes from "../views/VolumesPage.vue"
import Images from "../views/ImagesPage.vue"

const routes = [
	{
		path: "/",
		name: "/",
		redirect: "/dashboard",
	},
	{
		path: "/dashboard",
		name: "DashboarMain",
		component: DashboarMain,
	},
	{
		path: "/signin",
		name: "Sign",
		component: SignIn,
	},
	{
		path: "/instances",
		name: "Instances",
		component: Instances,
		props: true,
	},
	{
		path: "/volumes",
		name: "Volumes",
		component: Volumes,
		props: true,
	},
	{
		path: "/images",
		name: "Images",
		component: Images,
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
