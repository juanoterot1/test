<template>
  <div class="layout">
    <!-- Header solo si el usuario ha iniciado sesión -->
    <BlissHeader v-if="isLoggedIn" />

    <main class="content">
      <router-view />
    </main>

    <!-- Footer solo si el usuario ha iniciado sesión -->
    <BlissFooter v-if="isLoggedIn" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import BlissFooter from '@/components/BlissFooter.vue';

// Usar el mismo token para validar sesión
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token');
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  padding: 1rem;
}
</style>
