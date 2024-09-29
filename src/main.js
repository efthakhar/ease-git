import { createApp } from "vue";
import { createPinia } from "pinia";
import './css/bootstrap.css'
import router from "./router";
import "./css/ease-theme.css";
import Root from "./views/layouts/Root.vue";

const app = createApp(Root);
const store = createPinia();

app.use(store);
app.use(router);

app.mount("#ease-git-app");