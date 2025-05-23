<template>
  <main>
    <h1>Productos de Pastelería</h1>
    <button @click="mostrarModal = true" aria-label="Agregar producto" class="icono-boton">
      <PackagePlus class="icono-btn" />
    </button>



    <div id="articulos-lista">
      <div v-for="producto in productos" :key="producto.idproductos" class="producto-card"
        @click="redirectToDetalleArticulo(producto.idproductos)">
        <img :src="producto.imagen" :alt="'Imagen de ' + producto.nombre" />
        <div class="producto-info">
          <p class="nombre">{{ producto.nombre }}</p>
          <p class="descripcion">{{ producto.descripcion }}</p>
          <p class="precio">$ {{ producto.precio }}</p>
          <p class="stock" v-if="producto.stock !== undefined">Stock: {{ producto.stock }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para agregar producto -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <h3>Agregar nuevo producto</h3>

        <div class="modal-field">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="nuevoProducto.nombre" class="modal-input" />
        </div>

        <div class="modal-field">
          <label for="descripcion">Descripción</label>
          <input id="descripcion" v-model="nuevoProducto.descripcion" class="modal-input" />
        </div>

        <div class="modal-field">
          <label for="precio">Precio</label>
          <input id="precio" v-model.number="nuevoProducto.precio" type="number" min="0" step="0.01"
            placeholder="Precio" class="modal-input" />
        </div>

        <div class="modal-field">
          <label for="stock">Cantidad disponible</label>
          <input id="stock" v-model.number="nuevoProducto.stock" type="number" min="0" placeholder="Stock"
            class="modal-input" />
        </div>

        <div class="modal-field">
          <label for="imagen">URL de imagen</label>
          <input id="imagen" v-model="nuevoProducto.imagen" class="modal-input" />
        </div>

        <div class="modal-buttons">
          <button class="btn-confirmar" @click="agregarProducto">Agregar</button>
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import productosJSON from '@/json/productos.json';
import { PackagePlus} from 'lucide-vue-next';

export default {
  name: 'ArticulosPage',
  components: {
    PackagePlus
  },
  data() {
    return {
      productos: [],
      mostrarModal: false,
      nuevoProducto: {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagen: '',
      },
    };
  },
  methods: {
    redirectToDetalleArticulo(id) {
      this.$router.push({ name: 'detalleArticulo', params: { id: id } });
    },
    cargarDesdeJSON() {
      this.productos = productosJSON;
      console.log('Datos cargados desde JSON local:', this.productos);
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.resetNuevoProducto();
    },
    resetNuevoProducto() {
      this.nuevoProducto = {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagen: '',
      };
    },
    agregarProducto() {
      if (
        !this.nuevoProducto.nombre.trim() ||
        !this.nuevoProducto.descripcion.trim() ||
        this.nuevoProducto.precio <= 0 ||
        this.nuevoProducto.stock < 0 ||
        !this.nuevoProducto.imagen.trim()
      ) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }

      const maxId = this.productos.reduce(
        (max, p) => (p.idproductos > max ? p.idproductos : max),
        0
      );
      const nuevoId = maxId + 1;

      this.productos.push({
        idproductos: nuevoId,
        nombre: this.nuevoProducto.nombre,
        descripcion: this.nuevoProducto.descripcion,
        precio: this.nuevoProducto.precio,
        stock: this.nuevoProducto.stock,
        imagen: this.nuevoProducto.imagen,
      });

      this.cerrarModal();
    },
  },
  mounted() {
    this.cargarDesdeJSON();
  },
};
</script>

<style scoped src="@/styles/articulos.css"></style>
