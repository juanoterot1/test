<template>
  <div class="cliente-detalle-wrapper">
    <main>
      <div class="detalle-articulo">
        <div class="imagen-container">
          <div class="imagenes">
            <img
              v-for="(img, index) in articulo.imagenes"
              :key="index"
              :src="img"
              :alt="'Imagen ' + (index + 1)"
            />
          </div>
        </div>
        <div class="info-articulo">
          <h2>{{ articulo.nombre }}</h2>
          <p>{{ articulo.descripcion }}</p>
          <p>Precio: ${{ articulo.precio }}</p>
          <p class="stock">Stock disponible: {{ articulo.stock }}</p>

          <div class="cantidad-container">
            <div class="cantidad">
              <button class="cantidad-btn" @click="decrementarCantidad" :disabled="cantidad <= 1">-</button>
              <input
                class="cantidad-input"
                type="number"
                v-model.number="cantidad"
                :min="1"
                :max="articulo.stock || 1"
              />
              <button
                class="cantidad-btn"
                @click="incrementarCantidad"
                :disabled="cantidad >= (articulo.stock || 1)"
              >
                +
              </button>
            </div>

            <!-- Botón agregar al carrito con icono -->
            <button
              @click="agregarAlCarrito"
              class="comprar-btn"
              :disabled="cantidad > (articulo.stock || 0) || articulo.stock === 0"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart class="icono-btn" />
            </button>
          </div>

          <br />

          <!-- Botón comprar con icono -->
          <button
            class="comprar-btn"
            :disabled="cantidad > (articulo.stock || 0) || articulo.stock === 0"
            @click="handleComprar"
            aria-label="Comprar"
          >
            <DollarSign class="icono-btn" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ShoppingCart, DollarSign } from 'lucide-vue-next'
import productosJSON from '@/json/productos.json';

export default {
  components: {
    ShoppingCart,
    DollarSign,
  },
  data() {
    return {
      articulo: {
        imagenes: [],
        stock: 0,
      },
      cantidad: 1,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.cargarDesdeJSON(id);
  },
  methods: {
    cargarDesdeJSON(id) {
      const producto = productosJSON.find(
        (p) => p.idproductos === id || p.idproductos === Number(id)
      );
      if (producto) {
        this.articulo = producto;
        this.articulo.stock = Number(this.articulo.stock) || 0;
        if (!this.articulo.imagenes || this.articulo.imagenes.length === 0) {
          this.articulo.imagenes = [this.articulo.imagen || 'placeholder.jpg'];
        }
      } else {
        console.error('Producto no encontrado en JSON local.');
      }
    },
    incrementarCantidad() {
      if (this.cantidad < (this.articulo.stock || 1)) {
        this.cantidad++;
      }
    },
    decrementarCantidad() {
      if (this.cantidad > 1) {
        this.cantidad--;
      }
    },
    agregarAlCarrito() {
      console.log('Agregando al carrito:', this.articulo, 'Cantidad:', this.cantidad);
      if (this.cantidad <= (this.articulo.stock || 0) && this.articulo.stock > 0) {
        this.$store.dispatch('agregarAlCarrito', {
          articulo: this.articulo,
          cantidad: this.cantidad,
        });
        this.cantidad = 1; // reset cantidad después de agregar
      } else {
        console.error('No se puede agregar más de la cantidad disponible en stock');
      }
    },
    handleComprar() {
      if (this.cantidad <= (this.articulo.stock || 0) && this.articulo.stock > 0) {
        this.$store.dispatch('agregarAlCarrito', {
          articulo: this.articulo,
          cantidad: this.cantidad,
        });
        this.$router.push('/carrito');
      } else {
        console.error('No se puede comprar esa cantidad');
      }
    },
  },
};
</script>

<style scoped src="@/styles/detalle-articulo.css"></style>
