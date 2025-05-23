import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      carrito: []
    };
  },

  mutations: {
    agregarAlCarrito(state, item) {
      const existente = state.carrito.find(i => i.articulo.idproductos === item.articulo.idproductos);
      if (existente) {
        // Sumar pero no pasar del stock
        const nuevaCantidad = existente.cantidad + item.cantidad;
        if (nuevaCantidad <= item.articulo.stock) {
          existente.cantidad = nuevaCantidad;
        } else {
          existente.cantidad = item.articulo.stock; // máximo stock disponible
          // Aquí podrías avisar que excedió el stock, según UX
        }
      } else {
        // Agregar solo si cantidad <= stock
        if (item.cantidad <= item.articulo.stock) {
          state.carrito.push(item);
        } else {
          // Ajustar cantidad a stock disponible
          state.carrito.push({
            articulo: item.articulo,
            cantidad: item.articulo.stock
          });
        }
      }
    },

    vaciarCarrito(state) {
      state.carrito = [];
    },

    cambiarCantidad(state, { idproducto, cantidad }) {
      const item = state.carrito.find(i => i.articulo.idproductos === idproducto);
      if (item) {
        if (cantidad < 1) cantidad = 1;
        else if (cantidad > item.articulo.stock) cantidad = item.articulo.stock;
        item.cantidad = cantidad;
      }
    }
  },

  actions: {
    agregarAlCarrito({ commit }, item) {
      commit('agregarAlCarrito', item);
    },
    vaciarCarrito({ commit }) {
      commit('vaciarCarrito');
    },
    cambiarCantidad({ commit }, payload) {
      commit('cambiarCantidad', payload);
    }
  },

  getters: {
    carrito(state) {
      return state.carrito;
    }
  }
});

export default store;
