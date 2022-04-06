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

axios.defaults.timeout = 55000
const app = createApp(App).use(router).use(VueAxios, axios).use(Toaster)

app.mount("#app")
