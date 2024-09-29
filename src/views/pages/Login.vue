<script setup>
import { onBeforeMount, onMounted } from "vue";
import { useUiStore } from "../../stores/ui";
import { useRouter } from 'vue-router';

const uiStore = useUiStore();
const router = useRouter();

function handleFormSubmit() {
    uiStore.setRouteLoading(true);
    uiStore.logIn()
        .then((data) => {
            router.push({ name: 'dashboard' });
            uiStore.setRouteLoading(false);
        })
        .catch((error) => {
            console.error('Login failed:', error);
            uiStore.setRouteLoading(false);
        });
}



</script>

<template>
    <section class="d-flex justify-content-center bg-body py-5">
        <div class="bg-light-subtle rounded-0 border mt-5 px-3 py-5" style="max-width: 350px; width: 96%;">
            <h1 class="h2 mb-3 text-center fw-bold text-primary">ease git</h1>
            <div class="mb-5 border-bottom"></div>
            <div>
                <input style="text-align: center;" type="password" class="form-control rounded-0" id="token"
                    name="token" placeholder="Github Token" v-model="uiStore.githubToken">
            </div>
            <button @click="handleFormSubmit()" class="btn btn-primary w-100 mt-4 rounded-0">Sign In</button>
        </div>
    </section>
</template>
