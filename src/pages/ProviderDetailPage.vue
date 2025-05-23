<template>
  <div class="provider-detail-page">
    <BlissHeader />
    <div v-if="provider" class="provider-card">
      <h3 class="provider-name">
        <User class="icon-inline" /> {{ provider.name }}
      </h3>
      <div class="provider-row">
        <strong><Mail class="icon-inline" /> {{ provider.email }}</strong>
      </div>
      <div class="provider-row">
        <strong><Phone class="icon-inline" /> {{ provider.phone }}</strong>
      </div>
      <div class="provider-row">
        <strong><User class="icon-inline" /> {{ provider.contact }}</strong>
      </div>

      <div class="edit-button-container">
        <button class="edit-button" @click="showEditProviderModal = true">
          <Edit class="icon-inline" />
        </button>
      </div>

      <section class="sales-section">
        <h3>Historial de Ventas</h3>
        <div v-for="(venta, index) in provider.salesHistory" :key="index" class="sale-item">
          <div class="sale-text">
            <div><strong>Fecha:</strong> {{ venta.fecha }}</div>
            <div><strong>Venta:</strong> {{ venta.descripcion }}</div>
            <div><strong>Monto:</strong> ${{ venta.monto }}</div>
          </div>
          <div class="sale-buttons">
            <button class="edit-btn" @click="openEditSaleModal(index)">
              <Edit class="icon-inline" />
            </button>
            <button class="delete-btn" @click="confirmDeleteSale(index)">
              <Trash2 class="icon-inline" />
            </button>
          </div>
        </div>
        <button class="add-sale" @click="openAddSaleModal">
          <Plus class="icon-inline" />
        </button>
      </section>
    </div>
    <BlissFooter />

    <!-- Modal Editar Proveedor -->
    <div v-if="showEditProviderModal" class="modal-overlay">
      <div class="modal">
        <h3>Editar Proveedor</h3>
        <input v-model="tempProvider.name" placeholder="Nombre Proveedor" />
        <input v-model="tempProvider.contact" placeholder="Contacto" />
        <input v-model="tempProvider.phone" placeholder="Teléfono" />
        <input v-model="tempProvider.email" placeholder="Email" />
        <div class="modal-buttons">
          <button class="btn-confirmar" @click="confirmEditProvider">Guardar</button>
          <button class="btn-cancelar" @click="cancelEditProvider">Cancelar</button>
        </div>
      </div>
    </div>

 

    <!-- Modal Editar Venta -->
    <div v-if="showEditSaleModal" class="modal-overlay">
      <div class="modal">
        <h3>Editar Venta</h3>
        <input v-model="tempSale.fecha" placeholder="Fecha (YYYY-MM-DD)" />
        <input v-model="tempSale.descripcion" placeholder="Descripción" />
        <input v-model.number="tempSale.monto" placeholder="Monto" type="number" />
        <div class="modal-buttons">
          <button class="btn-confirmar" @click="confirmEditSale">Guardar</button>
          <button class="btn-cancelar" @click="cancelEditSale">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Venta -->
    <div v-if="showAddSaleModal" class="modal-overlay">
      <div class="modal">
        <h3>Agregar Venta</h3>
        <input v-model="tempSale.fecha" placeholder="Fecha (YYYY-MM-DD)" />
        <input v-model="tempSale.descripcion" placeholder="Descripción" />
        <input v-model.number="tempSale.monto" placeholder="Monto" type="number" />
        <div class="modal-buttons">
          <button class="btn-confirmar" @click="confirmAddSale">Agregar</button>
          <button class="btn-cancelar" @click="cancelAddSale">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminar Venta -->
    <div v-if="showDeleteSaleModal" class="modal-overlay">
      <div class="modal">
        <h3>Eliminar Venta</h3>
        <p>¿Seguro que deseas eliminar esta venta?</p>
        <div class="modal-buttons">
          <button class="btn-confirmar" @click="confirmDeleteSaleConfirmed">Eliminar</button>
          <button class="btn-cancelar" @click="cancelDeleteSale">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Mail, Phone, User, Edit, Trash2, Plus } from 'lucide-vue-next'
import BlissHeader from '@/components/BlissHeader.vue'
import BlissFooter from '@/components/BlissFooter.vue'
import providersData from '@/json/providers.json'

const router = useRouter()
const route = useRoute()
const provider = ref(null)

const showEditProviderModal = ref(false)
const showDeleteProviderModal = ref(false)

const showEditSaleModal = ref(false)
const showAddSaleModal = ref(false)
const showDeleteSaleModal = ref(false)

const tempProvider = ref({
  name: '',
  contact: '',
  phone: '',
  email: ''
})

const tempSale = ref({
  fecha: '',
  descripcion: '',
  monto: null
})

const editSaleIndex = ref(null)
const deleteSaleIndex = ref(null)

function loadProviderData() {
  const id = Number(route.params.id)
  const stored = localStorage.getItem('suppliers')
  const providers = stored ? JSON.parse(stored) : [...providersData]
  provider.value = providers.find(p => p.id === id) || null
}

onMounted(() => {
  loadProviderData()
})

watch(() => route.params.id, () => {
  loadProviderData()
})

function updateProviderInStorage() {
  const stored = localStorage.getItem('suppliers')
  if (!stored) return
  const providers = JSON.parse(stored)
  const index = providers.findIndex(p => p.id === provider.value?.id)
  if (index !== -1 && provider.value) {
    providers[index] = provider.value
    localStorage.setItem('suppliers', JSON.stringify(providers))
  }
}

// Editar proveedor
function editProvider() {
  if (!provider.value) return
  tempProvider.value = {
    name: provider.value.name,
    contact: provider.value.contact,
    phone: provider.value.phone,
    email: provider.value.email
  }
  showEditProviderModal.value = true
}

function confirmEditProvider() {
  provider.value.name = tempProvider.value.name
  provider.value.contact = tempProvider.value.contact
  provider.value.phone = tempProvider.value.phone
  provider.value.email = tempProvider.value.email
  updateProviderInStorage()
  showEditProviderModal.value = false
}

function cancelEditProvider() {
  showEditProviderModal.value = false
}

// Eliminar proveedor
function confirmDeleteProvider() {
  const stored = localStorage.getItem('suppliers')
  if (!stored) return
  const providers = JSON.parse(stored)
  const index = providers.findIndex(p => p.id === provider.value?.id)
  if (index !== -1) {
    providers.splice(index, 1)
    localStorage.setItem('suppliers', JSON.stringify(providers))
    showDeleteProviderModal.value = false
    router.push('/providers') // Redirige a la lista de proveedores
  }
}

function cancelDeleteProvider() {
  showDeleteProviderModal.value = false
}

// Ventas
function openEditSaleModal(index) {
  if (!provider.value) return
  const venta = provider.value.salesHistory[index]
  if (!venta) return
  editSaleIndex.value = index
  tempSale.value = { ...venta }
  showEditSaleModal.value = true
}

function confirmEditSale() {
  if (editSaleIndex.value === null) return
  provider.value.salesHistory[editSaleIndex.value] = { ...tempSale.value }
  updateProviderInStorage()
  showEditSaleModal.value = false
  editSaleIndex.value = null
}

function cancelEditSale() {
  showEditSaleModal.value = false
  editSaleIndex.value = null
}

function openAddSaleModal() {
  tempSale.value = { fecha: '', descripcion: '', monto: null }
  showAddSaleModal.value = true
}

function confirmAddSale() {
  if (!provider.value.salesHistory) provider.value.salesHistory = []
  provider.value.salesHistory.push({ ...tempSale.value })
  updateProviderInStorage()
  showAddSaleModal.value = false
}

function cancelAddSale() {
  showAddSaleModal.value = false
}

// Confirmar eliminar venta (nuevo modal)
function confirmDeleteSale(index) {
  deleteSaleIndex.value = index
  showDeleteSaleModal.value = true
}

function confirmDeleteSaleConfirmed() {
  if (deleteSaleIndex.value === null) return
  provider.value.salesHistory.splice(deleteSaleIndex.value, 1)
  updateProviderInStorage()
  showDeleteSaleModal.value = false
  deleteSaleIndex.value = null
}

function cancelDeleteSale() {
  showDeleteSaleModal.value = false
  deleteSaleIndex.value = null
}
</script>

<style scoped src="@/styles/providers-detail.css"></style>
