<template>
  <main class="catalog-page">
    <BlissHeader />

    <div class="catalog-container">
      <h1>Catálogo de Servicios</h1>
      <CatalogItem :node="root" />
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import CatalogItem from '@/components/CatalogItem.vue';
import { createDefaultCatalog } from '@/services/catalog';

const root = reactive(createDefaultCatalog());
</script>

<style scoped src="@/styles/catalog.css"></style>
