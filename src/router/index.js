import { createRouter, createWebHashHistory } from "vue-router"
import DashboarMain from "../views/DashboardMain.vue"
import SignIn from "../views/SignIn.vue"
import Instances from "../views/InstancesPage.vue"
import Volumes from "../views/VolumesPage.vue"
import Images from "../views/ImagesPage.vue"
import Network from "../views/NetworkPage.vue"

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
	},
	{
		path: "/volumes",
		name: "Volumes",
		component: Volumes,
	},
	{
		path: "/images",
		name: "Images",
		component: Images,
	},
	{
		path: "/network",
		name: "Network",
		component: Network,
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
