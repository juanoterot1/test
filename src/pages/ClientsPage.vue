<template>
  <div class="clients-page">
    <BlissHeader />

    <div class="content-container scrollable-content">
      <div class="left-column">
        <div class="search-filter-bar">
          <input class="search-input" v-model="searchQuery" placeholder="Buscar cliente" />
          <button class="filter-button" @click="openFilterModal">
            <FunnelIcon class="icon" />
            <span>Filtros</span>
          </button>
        </div>

        <div class="right-column">
          <div class="fab-button-container">
            <button class="fab-button" @click="openAddCustomerModal">
              <UserPlusIcon class="icon" />
            </button>
          </div>

          <div v-if="filteredCustomers.length === 0" class="no-customers">
            No hay clientes registrados
          </div>

          <div class="clients-list-wrapper">
            <div
              v-for="customer in filteredCustomers"
              :key="customer.id"
              class="customer-card"
              @click="showOptions(customer)"
            >
              <div class="customer-info">
                <div class="customer-number">{{ customer.id }}</div>
                <div>
                  <div class="customer-name">{{ customer.name }}</div>
                  <div class="customer-address">{{ customer.address }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL AGREGAR CLIENTE -->
    <div v-if="showAddModal" class="modal-backdrop">
      <div class="custom-alert">
        <h2>Agregar Cliente</h2>
        <input v-model="newCustomer.name" type="text" placeholder="Nombre completo" />
        <input v-model="newCustomer.address" type="text" placeholder="Dirección" />
        <input v-model="newCustomer.phone" type="text" placeholder="Teléfono (opcional)" />
        <div class="modal-buttons">
          <button @click="closeAddCustomerModal">Cancelar</button>
          <button @click="saveNewCustomer">Guardar</button>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR CLIENTE -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="custom-alert">
        <h2>Editar Cliente</h2>
        <input v-model="editCustomerData.name" type="text" placeholder="Nombre" />
        <input v-model="editCustomerData.address" type="text" placeholder="Dirección" />
        <input v-model="editCustomerData.phone" type="text" placeholder="Teléfono" />
        <div class="modal-buttons">
          <button @click="closeEditCustomerModal">Cancelar</button>
          <button @click="saveEditedCustomer">Guardar</button>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMAR ELIMINAR -->
    <div v-if="showDeleteConfirm" class="modal-backdrop">
      <div class="custom-alert">
        <h2>¿Eliminar cliente?</h2>
        <p>¿Deseas eliminar a <strong>{{ deleteCustomerData.name }}</strong>?</p>
        <div class="modal-buttons">
          <button @click="closeDeleteConfirm">Cancelar</button>
          <button @click="confirmDeleteCustomer" class="danger">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- MODAL OPCIONES CLIENTE -->
    <div v-if="showOptionsModal" class="modal-backdrop">
      <div class="custom-alert">
        <h2>Opciones para {{ optionsCustomer.name }}</h2>
        <div class="modal-buttons vertical">
          <button @click="startEditCustomer(optionsCustomer)">Editar</button>
          <button @click="startDeleteCustomer(optionsCustomer)" class="danger">Eliminar</button>
          <button @click="goToMoreInfo(optionsCustomer)">Más información</button>
          <button @click="closeOptionsModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- MODAL FILTROS -->
    <div v-if="showFilterModal" class="modal-backdrop">
      <div class="custom-alert">
        <h2>Filtros de búsqueda</h2>
        <label class="filter-option">
          <input type="checkbox" v-model="selectedFilters.name" />
          Filtrar por nombre
        </label>
        <label class="filter-option">
          <input type="checkbox" v-model="selectedFilters.address" />
          Filtrar por dirección
        </label>
        <div class="modal-buttons">
          <button @click="applyFilters">Aplicar</button>
          <button @click="closeFilterModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import BlissHeader from '@/components/BlissHeader.vue';
import { UserPlusIcon, FunnelIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const customers = ref([]);
const searchQuery = ref('');
const selectedFilters = ref({ name: true, address: true });

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const showOptionsModal = ref(false);
const showFilterModal = ref(false);

const newCustomer = ref({ name: '', address: '', phone: '' });
const editCustomerData = ref({ id: null, name: '', address: '', phone: '' });
const deleteCustomerData = ref({ id: null, name: '' });
const optionsCustomer = ref({ id: null, name: '', address: '', phone: '' });

// Usuario autenticado
const currentUser = computed(() => {
  const stored = localStorage.getItem('user') || '{}';
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
});

const loadCustomers = async () => {
  try {
    const resp = await api.get('/customers');
    customers.value = resp.data.result;
  } catch (e) {
    console.error('Error loading customers:', e);
  }
};

onMounted(() => {
  loadCustomers();
});

const filteredCustomers = computed(() => {
  let filtered = customers.value;
  if (searchQuery.value.trim()) {
    filtered = filtered.filter((c) => {
      const matchName =
        selectedFilters.value.name && c.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchAddress =
        selectedFilters.value.address && c.address.toLowerCase().includes(searchQuery.value.toLowerCase());
      return matchName || matchAddress;
    });
  }
  return filtered;
});

// Agregar cliente
const openAddCustomerModal = () => {
  newCustomer.value = { name: '', address: '', phone: '' };
  showAddModal.value = true;
};
const closeAddCustomerModal = () => {
  showAddModal.value = false;
};

const saveNewCustomer = async () => {
  if (!newCustomer.value.name.trim() || !newCustomer.value.address.trim()) return;
  try {
    const resp = await api.post('/customers', {
      user_id: currentUser.value.id,
      name: newCustomer.value.name,
      address: newCustomer.value.address,
      phone: newCustomer.value.phone
    });
    customers.value.push(resp.data.result[0]);
    showAddModal.value = false;
  } catch (e) {
    console.error('Error creating customer:', e);
  }
};

// Opciones cliente
const showOptions = (customer) => {
  optionsCustomer.value = { ...customer };
  showOptionsModal.value = true;
};
const closeOptionsModal = () => {
  showOptionsModal.value = false;
};

// Editar cliente
const startEditCustomer = (customer) => {
  editCustomerData.value = { ...customer };
  showEditModal.value = true;
  showOptionsModal.value = false;
};
const closeEditCustomerModal = () => {
  showEditModal.value = false;
};

const saveEditedCustomer = async () => {
  try {
    const resp = await api.put(`/customers/${editCustomerData.value.id}`, {
      name: editCustomerData.value.name,
      address: editCustomerData.value.address,
      phone: editCustomerData.value.phone
    });
    const index = customers.value.findIndex((c) => c.id === editCustomerData.value.id);
    customers.value.splice(index, 1, resp.data.result[0]);
    showEditModal.value = false;
  } catch (e) {
    console.error('Error updating customer:', e);
  }
};

// Eliminar cliente
const startDeleteCustomer = (customer) => {
  deleteCustomerData.value = { ...customer };
  showDeleteConfirm.value = true;
  showOptionsModal.value = false;
};
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
};
const confirmDeleteCustomer = async () => {
  try {
    await api.delete(`/customers/${deleteCustomerData.value.id}`);
    customers.value = customers.value.filter((c) => c.id !== deleteCustomerData.value.id);
    showDeleteConfirm.value = false;
  } catch (e) {
    console.error('Error deleting customer:', e);
  }
};

// Más info
const goToMoreInfo = (customer) => {
  showOptionsModal.value = false;
  router.push({ name: 'ClientDetail', params: { id: Number(customer.id) } });
};

// Filtros
const openFilterModal = () => {
  showFilterModal.value = true;
};
const closeFilterModal = () => {
  showFilterModal.value = false;
};
const applyFilters = () => {
  showFilterModal.value = false;
};
</script>

<style scoped src="@/styles/clients.css"></style>
