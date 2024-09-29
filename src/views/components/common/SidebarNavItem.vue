<script setup>
import { onMounted, ref, useTemplateRef, watchEffect } from 'vue'
import { useRoute } from 'vue-router';
const props = defineProps(['icon', 'link', 'label', 'sublinks']);
const sublinksCollapsed = ref(true);
const route = useRoute();
const navItemRef = useTemplateRef('nav-item');


const checkActiveSublink = (items) => {
    items?.some(item => {
        if (item.link == route.path || checkActiveSublink(item.sublinks)) {
            sublinksCollapsed.value = false;
            return;
        }
    })
    return false;
}

const scrollToViewIfActive = () => {
    if (route.path === props.link) {
        navItemRef.value?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }
};


watchEffect(
    () => route.path,
    [scrollToViewIfActive, checkActiveSublink(props.sublinks)],
    { immediate: true }
);

onMounted(() => {
    checkActiveSublink(props.sublinks);
    scrollToViewIfActive()
})

</script>
<template>
    <div class="sidebar-nav-item" :class="{ 'collapsed': sublinksCollapsed }">
        <!-- for single nav item -->
        <RouterLink v-if="!sublinks" class="sidebar-nav-link" :to="link" exactActiveClass="active">
            <span class="sidebar-nav-link-icon" ref="nav-item">
                <component :is="icon" width="20" height="20" strokeWidth="2"></component>
            </span>
            <span class="sidebar-nav-link-text">
                {{ label }}
            </span>
        </RouterLink>

        <!-- for sublink included nav item -->
        <span v-if="sublinks" class="sidebar-nav-link" @click="sublinksCollapsed = !sublinksCollapsed">
            <span class="sidebar-nav-link-icon">
                <component :is="icon" width="20" height="20" strokeWidth="2"></component>
            </span>
            <span class="sidebar-nav-link-text">
                {{ label }}
            </span>
            <span class="sidebar-nav-link-toggle-icon ms-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
            </span>
        </span>

        <div v-if="sublinks" class="sidebar-nav-item-subitems">
            <SidebarNavItem v-for="sublink in sublinks" :label="sublink.label" :link="sublink.link" :icon="sublink.icon"
                :sublinks="sublink.sublinks" />
        </div>
    </div>
</template>