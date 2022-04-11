//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "bootstrap"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import VueAxios from "vue-axios"

//Notify plugin
import Toaster from "vue-toast-notification"
import "vue-toast-notification/dist/theme-sugar.css"

const app = createApp(App).use(router).use(VueAxios, axios).use(Toaster)

//Global variables
app.config.globalProperties.$ipOpenStack = []
app.config.globalProperties.$projectsTokens = []
app.config.globalProperties.$currentProjectName = "demo"
app.config.globalProperties.$currentProjectId = ""

app.mount("#app")
