<script setup>
import { useUiStore } from '../../../stores/ui';
import HomeIcon from '../../../icons/HomeIcon.vue';
import SidebarNavItem from './SidebarNavItem.vue';
import BoxIcon from '../../../icons/BoxIcon.vue';
const items = [
    {
        'label': 'Dashboard',
        'link': '/',
        'icon': HomeIcon,
    },

    {
        'label': 'Repos',
        'link': '/repos',
        'icon': BoxIcon,

    },
];
</script>

<template>
    <div class="sidebar border border-right border-top-0 d-flex flex-column justify-content-between bg-light-subtle">
        <div class="sidebar-nav px-2">
            <SidebarNavItem v-for="item in items" :label="item.label" :icon="item.icon" :link="item.link"
                :sublinks="item.sublinks" />
        </div>
        <div class="btn rounded-0 sidebar-toggle-icon d-flex justify-content-center 
                    border-top border-0 p-2 position-sticky bottom-0 margin-top-auto bg-light-subtle"
            @click="useUiStore().setSidebarCollpased(!useUiStore().sidebarCollapsed)">
            <svg v-if="!useUiStore().sidebarCollapsed" width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                    d="M4.83578 12L11.0429 18.2071L12.4571 16.7929L7.66421 12L12.4571 7.20712L11.0429 5.79291L4.83578 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z">
                </path>
            </svg>
            <svg v-if="useUiStore().sidebarCollapsed" width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                    d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z">
                </path>
            </svg>
        </div>
    </div>
</template>