<template>
  <div class="client-detail-page">
    <BlissHeader />

    <div class="detail-container">
      <div v-if="client">
        <div class="client-card">
          <h3>{{ client.nombre }}</h3>
          <p class="direccion">{{ client.direccion }}</p>
          <hr class="separator" />
          <p class="section-title">Información de Contacto Directo</p>

          <div class="info-item" v-if="client.telefono">
            <PhoneIcon class="icon" />
            <span>{{ client.telefono }}</span>
          </div>
          <div class="info-item" v-if="client.correo">
            <MailIcon class="icon" />
            <span>{{ client.correo }}</span>
          </div>
          <div class="info-item" v-if="client.estadoCuenta !== undefined">
            <DollarSignIcon class="icon" />
            <span>Estado de Cuenta: ${{ client.estadoCuenta }}</span>
          </div>

          <button class="fab-button" @click="mostrarEditarContacto = true">
            <PlusIcon class="icon" />
          </button>
        </div>

        <div class="order-history">
          <div class="order-header">
            <h4>Historial de Pedidos</h4>
            <button class="add-button" @click="mostrarAgregarPedido = true">
              <ShoppingCartIcon class="icon" />
            </button>
          </div>

          <div v-if="client.historialPedidos && client.historialPedidos.length">
            <div class="pedido-item" v-for="(pedido, index) in client.historialPedidos" :key="index"
              @click="abrirEditarPedido(index)">
              <p><strong>Fecha:</strong> {{ pedido.fecha }}</p>
              <p><strong>Producto:</strong> {{ pedido.producto }}</p>
              <p><strong>Monto:</strong> ${{ pedido.monto }}</p>
            </div>
          </div>
          <div v-else>
            <p class="no-orders">No hay pedidos registrados.</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Cliente no encontrado.</p>
      </div>
    </div>

    <!-- Modal Editar Contacto -->
    <div v-if="mostrarEditarContacto" class="modal-overlay">
      <div class="modal">
        <h3>Editar Contacto</h3>
        <input v-model="tempContacto.telefono" type="tel" placeholder="Teléfono" />
        <input v-model="tempContacto.correo" type="email" placeholder="Correo" />
        <input v-model.number="tempContacto.estadoCuenta" type="number" placeholder="Estado de cuenta" />
        <div class="modal-buttons">
          <button class="save-button" @click="guardarContacto">Guardar</button>
          <button class="cancel-button" @click="cerrarEditarContacto">Cancelar</button>
       
        </div>
      </div>
    </div>

    <!-- Modal Agregar Pedido -->
    <div v-if="mostrarAgregarPedido" class="modal-overlay">
      <div class="modal">
        <h3>Agregar Pedido</h3>
        <input v-model="nuevoPedido.fecha" type="text" placeholder="Fecha" />
        <input v-model="nuevoPedido.producto" type="text" placeholder="Producto" />
        <input v-model.number="nuevoPedido.monto" type="number" placeholder="Monto" />
        <div class="modal-buttons">
          <button class="save-button" @click="guardarPedido">Agregar</button>
          <button class="cancel-button" @click="cerrarAgregarPedido">Cancelar</button>

        </div>
      </div>
    </div>

    <!-- Modal Editar Pedido -->
    <div v-if="mostrarEditarPedido" class="modal-overlay">
      <div class="modal">
        <h3>Editar Pedido</h3>
        <input v-model="pedidoEditado.fecha" type="text" placeholder="Fecha" />
        <input v-model="pedidoEditado.producto" type="text" placeholder="Producto" />
        <input v-model.number="pedidoEditado.monto" type="number" placeholder="Monto" />
        <div class="modal-buttons">
          <button class="save-button" @click="guardarEdicionPedido">Guardar</button>
          <button class="delete-button" @click="eliminarPedido">Eliminar</button>
          <button class="cancel-button" @click="cerrarEditarPedido">Cancelar</button>


        </div>
      </div>
    </div>

    <BlissFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BlissHeader from '@/components/BlissHeader.vue'
import BlissFooter from '@/components/BlissFooter.vue'
import clientsJson from '@/json/Clients.json'
import { PhoneIcon, MailIcon, DollarSignIcon, ShoppingCartIcon, PlusIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const client = ref(null)
const mostrarEditarContacto = ref(false)
const mostrarAgregarPedido = ref(false)
const mostrarEditarPedido = ref(false)

const tempContacto = ref({ telefono: '', correo: '', estadoCuenta: 0 })
const nuevoPedido = ref({ fecha: '', producto: '', monto: 0 })
const pedidoEditado = ref({ fecha: '', producto: '', monto: 0 })
let indexPedidoEditado = null

const cargarCliente = () => {
  const id = Number(route.params.id)
  let clientsSaved = JSON.parse(localStorage.getItem('clients') || '[]')
  if (clientsSaved.length === 0) {
    clientsSaved = [...clientsJson]
    localStorage.setItem('clients', JSON.stringify(clientsSaved))
  }
  const foundClient = clientsSaved.find(c => c.id === id) || null
  client.value = foundClient
}

const guardarCambios = () => {
  let clients = JSON.parse(localStorage.getItem('clients') || '[]')
  const index = clients.findIndex(c => c.id === client.value.id)
  if (index !== -1) {
    clients[index] = { ...client.value }
  }
  localStorage.setItem('clients', JSON.stringify(clients))
}

// Editar contacto
const cerrarEditarContacto = () => {
  mostrarEditarContacto.value = false
}
const guardarContacto = () => {
  client.value.telefono = tempContacto.value.telefono
  client.value.correo = tempContacto.value.correo
  client.value.estadoCuenta = parseFloat(tempContacto.value.estadoCuenta)
  guardarCambios()
  cerrarEditarContacto()
}
const abrirEditarContacto = () => {
  tempContacto.value = {
    telefono: client.value.telefono || '',
    correo: client.value.correo || '',
    estadoCuenta: client.value.estadoCuenta || 0
  }
  mostrarEditarContacto.value = true
}

// Agregar pedido
const cerrarAgregarPedido = () => {
  mostrarAgregarPedido.value = false
  nuevoPedido.value = { fecha: '', producto: '', monto: 0 }
}
const guardarPedido = () => {
  if (!client.value.historialPedidos) {
    client.value.historialPedidos = []
  }
  client.value.historialPedidos.push({ ...nuevoPedido.value })
  guardarCambios()
  cerrarAgregarPedido()
}

// Editar pedido
const abrirEditarPedido = (index) => {
  const pedido = client.value.historialPedidos[index]
  pedidoEditado.value = { ...pedido }
  indexPedidoEditado = index
  mostrarEditarPedido.value = true
}
const cerrarEditarPedido = () => {
  mostrarEditarPedido.value = false
  pedidoEditado.value = { fecha: '', producto: '', monto: 0 }
}
const guardarEdicionPedido = () => {
  client.value.historialPedidos[indexPedidoEditado] = { ...pedidoEditado.value }
  guardarCambios()
  cerrarEditarPedido()
}
const eliminarPedido = () => {
  client.value.historialPedidos.splice(indexPedidoEditado, 1)
  guardarCambios()
  cerrarEditarPedido()
}

onMounted(() => {
  cargarCliente()
})
</script>

<style scoped src="@/styles/client-detail.css"></style>
