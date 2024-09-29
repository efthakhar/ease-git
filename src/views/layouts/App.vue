<script setup>
import { onMounted } from 'vue';
import { useUiStore } from '../../stores/ui';
import Sidebar from '../components/common/sidebar.vue';
import Topbar from '../components/common/Topbar.vue';


</script>
<template>
    <div class="ease-admin-page">
        <Topbar />
        <div class="sidebar-and-content" :class="{ 'sidebar-collapsed': useUiStore().sidebarCollapsed }">
            <Sidebar />
            <div class="main-content bg-body p-3 px-md-3 py-4">
                <router-view />
            </div>
        </div>
    </div>
</template>