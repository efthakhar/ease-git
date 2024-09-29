<script setup>
import { ref } from 'vue';
import { useUiStore } from '../../../stores/ui';
import { useRouter } from 'vue-router';

const router = useRouter();
const uiStore = useUiStore();
const userActionOpen = ref(false);
function logout() {
    useUiStore().setLogin(false);
    router.push({ 'name': 'login' });
}
</script>
<template>
    <div
        class="topbar border border-bottom border-top-0 px-2 d-flex align-items-center justify-content-between justify-content-md-start bg-light-subtle">
        <div class="sidebar-toggle-icon d-block d-sm-none me-3"
            @click="useUiStore().setSidebarCollpased(!useUiStore().sidebarCollapsed)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z"></path>
            </svg>
        </div>
        <RouterLink class="h4 text-primary text-decoration-none" to="/">
            ease git
        </RouterLink>

        <div class="d-none d-md-block ms-auto me-2">
           Hi, {{ uiStore.githubUsername }}
        </div>
        <div tabindex="-1" @blur="userActionOpen = false" class=" topbar-actions-btn">
            <span @click="userActionOpen = !userActionOpen" class="sq-32-icon-container"
                :class="{ 'text-primary': userActionOpen, 'border-primary-subtle': userActionOpen }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z">
                    </path>
                </svg>
            </span>
            <div class="topbar-actions-list shadow" v-if="userActionOpen">
                <ul class="list-group">
                   
                    <li class="list-group-item text-center d-block d-md-none">
                        Hi, {{ uiStore.githubUsername }}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Theme
                        <div class="sq-32-icon-container">
                            <svg v-if="useUiStore().theme == 'light'" @click="useUiStore().setTheme('dark')" width="20"
                                height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z">
                                </path>
                            </svg>
                            <svg v-if="useUiStore().theme == 'dark'" @click="useUiStore().setTheme('light')"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                                fill="currentColor">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M12 21.9967C6.47715 21.9967 2 17.5196 2 11.9967C2 6.47386 6.47715 1.9967 12 1.9967C17.5228 1.9967 22 6.47386 22 11.9967C22 17.5196 17.5228 21.9967 12 21.9967ZM12 19.9967C16.4183 19.9967 20 16.415 20 11.9967C20 7.57843 16.4183 3.9967 12 3.9967C7.58172 3.9967 4 7.57843 4 11.9967C4 16.415 7.58172 19.9967 12 19.9967ZM7.00035 15.316C9.07995 15.1646 11.117 14.2939 12.7071 12.7038C14.2972 11.1137 15.1679 9.07666 15.3193 6.99706C15.6454 7.21408 15.955 7.46642 16.2426 7.75406C18.5858 10.0972 18.5858 13.8962 16.2426 16.2393C13.8995 18.5825 10.1005 18.5825 7.75736 16.2393C7.46971 15.9517 7.21738 15.6421 7.00035 15.316Z">
                                </path>
                            </svg>
                        </div>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Log Out
                        <div class="sq-32-icon-container text-danger" @click="logout()">
                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path
                                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z">
                                </path>
                            </svg>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sq-32-icon-container {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid var(--bs-border-color);
    cursor: pointer;
}

.topbar-actions-btn {
    position: relative;
}

.topbar-actions-list {
    position: absolute;
    top: 120%;
    right: 10px;
    width: 240px;
    height: auto;
    max-height: 200px;
    border-radius: 5px;
    padding: 10px;
    overflow-y: auto;
    background-color: var(--bs-light-bg-subtle);
}
</style>