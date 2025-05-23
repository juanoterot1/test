<template>
  <div :class="['catalog-item', { group: isGroup, leaf: isLeaf }]">
    <div class="item-header" @click="toggle">
      <component :is="isGroup ? FolderIcon : CubeIcon" class="icon" />
      <span class="item-name">{{ node.name }}</span>
      <span v-if="isGroup" class="toggle-icon">{{ isOpen ? '−' : '+' }}</span>
    </div>

    <ul v-if="isGroup && isOpen" class="children-list">
      <li v-for="child in node.children" :key="child.name">
        <CatalogItem :node="child" />
      </li>
    </ul>

    <div v-if="isLeaf" class="leaf-details">
      <p><strong>Tarifa:</strong> {{ node.rate }} USD</p>
      <p><strong>Modalidad:</strong> {{ node.deliveryModes.join(', ') }}</p>
      <p><strong>Contacto:</strong> {{ node.contact }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { FolderIcon, CubeIcon } from '@heroicons/vue/24/outline';
import CatalogItem from './CatalogItem.vue';

const props = defineProps({ node: Object });
const isOpen = ref(true);
const isGroup = Array.isArray(props.node.children) && props.node.children.length > 0;
const isLeaf  = !isGroup;

function toggle() {
  if (isGroup) isOpen.value = !isOpen.value;
}
</script>

<style scoped>
.catalog-item {
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background-color: #e5d6f8;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.item-header:hover {
  background-color: #d4b3f0;
}
.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6e1b9a;
  margin-right: 0.5rem;
}
.item-name {
  font-weight: bold;
  color: #5e4db2;
}
.toggle-icon {
  margin-left: auto;
  font-size: 1.2rem;
  color: #5e4db2;
}

.children-list {
  list-style: none;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.leaf-details {
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  background-color: #f7eaff;
  border-radius: 8px;
  color: #4a3c71;
  font-size: 0.95rem;
}
.leaf-details p {
  margin: 0.3rem 0;
}
</style>
