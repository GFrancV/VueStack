//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "bootstrap"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import axios from "axios"

//Notify plugin
import Toaster from "vue-toast-notification"
import "vue-toast-notification/dist/theme-sugar.css"

const app = createApp(App).use(router).use(Toaster)

//Change this URL to test
const url = "http://10.20.139.17:40080"

axios.defaults.baseURL = url
app.config.globalProperties.$axios = axios
app.config.globalProperties.$serverUrl = url

app.mount("#app")
