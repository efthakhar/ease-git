<script setup>
import { onBeforeMount } from "vue";
import { useUiStore } from "../../stores/ui";
const uiStore = useUiStore();
onBeforeMount(() => {
    uiStore.retrieveSavedData();
})

</script>


<template>
    <div>
        <div class="pagetop-loading-bar" v-if="useUiStore().routeLoading"></div>
        <router-view />
    </div>
</template>