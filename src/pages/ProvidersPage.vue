<template>
  <div class="providers-wrapper">
    <BlissHeader />

    <div class="providers-container">
      <!-- Fila de búsqueda y filtro -->
      <div class="filters-row">
        <input
          class="search-input"
          v-model="searchText"
          placeholder="Buscar proveedores"
        />
        <button class="filter-button" @click="openFilter">
          <FunnelIcon class="icon" />
          <span>Filtros</span>
        </button>
      </div>

      <!-- Botón agregar proveedor arriba y centrado -->
      <div class="add-provider-wrapper">
        <button class="icono-boton" @click="openAddSupplierModal">
          <Plus class="icono-btn" />
        </button>
      </div>

      <div v-if="filteredProviders.length === 0" class="no-providers">
        No hay proveedores registrados
      </div>

      <div class="providers-list">
        <div
          v-for="provider in filteredProviders"
          :key="provider.id"
          class="provider-card"
        >
          <div
            class="provider-info"
            @click="goToProviderDetail(provider.id)"
          >
            <h2 class="provider-name">{{ provider.name }}</h2>

            <div class="contact-info">
              <p class="contact-item">
                <Mail class="icon-inline" /> {{ provider.contact }}
              </p>
              <p class="contact-item">
                <span v-if="provider.commission !== null">
                  Comisión: {{ provider.commission }}%
                </span>
              </p>
            </div>
          </div>

          <button
            class="delete-button"
            @click="confirmDeleteProvider(provider.id)"
          >
            <Trash2 class="icon-inline" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar proveedor -->
    <div
      v-if="showAddModal"
      class="modal-overlay"
      @click.self="showAddModal = false"
    >
      <div class="modal" @click.stop>
        <h3>Agregar Proveedor</h3>
        <form @submit.prevent="saveNewProvider">
          <div class="modal-field">
            <label>Nombre</label>
            <input v-model="newProvider.name" type="text" />
            <span class="error" v-if="formErrors.name">{{ formErrors.name }}</span>
          </div>

          <div class="modal-field">
            <label>Contacto</label>
            <input v-model="newProvider.contact" type="text" />
            <span class="error" v-if="formErrors.contact">{{ formErrors.contact }}</span>
          </div>

          <div class="modal-field">
            <label>Comisión (%)</label>
            <input v-model="newProvider.commission" type="number" step="0.01" />
            <span class="error" v-if="formErrors.commission">{{ formErrors.commission }}</span>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="btn-confirmar">Guardar</button>
            <button
              type="button"
              class="btn-cancelar"
              @click="showAddModal = false"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para filtros -->
    <div
      v-if="showFilterModal"
      class="modal-overlay"
      @click.self="closeFilterModal"
    >
      <div class="modal" @click.stop>
        <h3>Filtrar Proveedores</h3>
        <!-- Aquí podrías añadir filtros adicionales si los necesitas -->
        <div class="modal-buttons">
          <button class="btn-confirmar" @click="applyFilter">Aplicar</button>
          <button class="btn-cancelar" @click="closeFilterModal">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <BlissFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import BlissHeader from '@/components/BlissHeader.vue';
import BlissFooter from '@/components/BlissFooter.vue';
import { Mail, Trash2, FunnelIcon, Plus } from 'lucide-vue-next';

const router = useRouter();
const providers = ref([]);
const searchText = ref('');
const showFilterModal = ref(false);

// Modal agregar
const showAddModal = ref(false);
const newProvider = ref({ name: '', contact: '', commission: '' });
const formErrors = ref({});

// Load suppliers
onMounted(async () => {
  try {
    const resp = await api.get('/suppliers');
    providers.value = resp.data.result;
  } catch (e) {
    console.error('Error loading suppliers:', e);
  }
});

const filteredProviders = computed(() => {
  return providers.value.filter((p) =>
    p.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

function goToProviderDetail(id) {
  router.push({ name: 'providerDetail', params: { id } });
}

function openFilter() {
  showFilterModal.value = true;
}
function closeFilterModal() {
  showFilterModal.value = false;
}
function applyFilter() {
  showFilterModal.value = false;
}

function openAddSupplierModal() {
  newProvider.value = { name: '', contact: '', commission: '' };
  formErrors.value = {};
  showAddModal.value = true;
}

function validateForm() {
  formErrors.value = {};
  if (!newProvider.value.name) formErrors.value.name = 'Nombre es obligatorio';
  // contact optional
  if (
    newProvider.value.commission &&
    (isNaN(newProvider.value.commission) || newProvider.value.commission < 0)
  ) {
    formErrors.value.commission = 'Comisión inválida';
  }
  return Object.keys(formErrors.value).length === 0;
}

async function saveNewProvider() {
  if (!validateForm()) return;
  try {
    const payload = {
      name: newProvider.value.name,
      contact: newProvider.value.contact,
      commission: newProvider.value.commission || null
    };
    const resp = await api.post('/suppliers', payload);
    providers.value.push(resp.data.result[0]);
    showAddModal.value = false;
  } catch (e) {
    console.error('Error creating supplier:', e);
  }
}

function confirmDeleteProvider(id) {
  if (!confirm('¿Eliminar proveedor?')) return;
  api.delete(`/suppliers/${id}`)
    .then(() => {
      providers.value = providers.value.filter(p => p.id !== id);
    })
    .catch(e => console.error('Error deleting supplier:', e));
}
</script>

<style scoped src="@/styles/providers.css"></style>
