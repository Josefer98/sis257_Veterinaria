<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const route = useRoute()

// Verificar si la ruta actual es login
const isLoginPage = computed(() => route.path === '/login')

// Verificar si la ruta actual es home
const isHomePage = computed(() => route.path === '/')

// Aplicar fondo rosa solo si NO es login
const shouldApplyBackground = computed(() => !isLoginPage.value)
</script>

<template>
  <main :class="{ 'custom-background': shouldApplyBackground }">
    <MainHeader v-if="!isLoginPage" />
    <RouterView />
  </main>
  <MainFooter v-if="!isLoginPage" />
</template>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/owl.carousel.min.css';
@import '@/assets/css/slicknav.css';
@import '@/assets/css/flaticon.css';
@import '@/assets/css/animate.min.css';
@import '@/assets/css/magnific-popup.css';
@import '@/assets/css/fontawesome-all.min.css';
@import '@/assets/css/themify-icons.css';
@import '@/assets/css/slick.css';
@import '@/assets/css/nice-select.css';
@import '@/assets/css/style.css';

/* Color de fondo solo para vistas que no sean login */
main.custom-background {
  background-color: #f7dad8 !important;
  min-height: 100vh;
}
</style>
