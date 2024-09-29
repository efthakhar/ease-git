import { createRouter, createWebHistory } from "vue-router";
import { useUiStore } from "../stores/ui";

const router = createRouter({
    mode: "hash",
    history: createWebHistory(),

    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/pages/Login.vue"),
        },
        {
            path: "/",
            name: "app",
            component: () => import("../views/layouts/App.vue"),
            children: [
                {
                    name: "dashboard",
                    path: "",
                    component: () => import("../views/pages/Dashboard.vue"),
                },
                {
                    name: "repos",
                    path: "repos",
                    component: () => import("../views/pages/Repos.vue"),
                },
            ],
        },
    ],
});


router.beforeEach((to, from, next) => {
    const savedLogin = JSON.parse(localStorage.getItem('login')) || false; 
    const uiStore = useUiStore();
    uiStore.setRouteLoading(true);

    if (!savedLogin && to.name !== 'login') {
        next({ name: 'login' });
    } else {
        next();
    }
});

router.afterEach(() => {
    useUiStore().setRouteLoading(false);
});

export default router;
