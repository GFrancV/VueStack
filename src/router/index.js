import { createRouter, createWebHashHistory } from "vue-router"
import DashboarMain from "../views/DashboardMain.vue"
import SignIn from "../views/SignIn.vue"

const routes = [
	{
		path: "/",
		name: "/",
		redirect: "/dashboard",
	},
	{
		path: "/dashboard",
		name: "dashboarMain",
		component: DashboarMain,
	},
	{
		path: "/signin",
		name: "sign",
		component: SignIn,
	},
	{
		path: "/about",
		name: "about",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
