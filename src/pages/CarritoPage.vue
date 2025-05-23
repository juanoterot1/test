<template>
    <main class="carrito-page">
        <div class="carrito-card">
            <h1 class="titulo-principal">Carrito de Compras</h1>

            <div v-if="carritoCompleto.length === 0" class="carrito-vacio">
                <p>No hay artículos en el carrito.</p>
            </div>

            <div v-else>
                <div v-for="(item, index) in carritoCompleto" :key="index" class="cart-item">
                    <div class="imagen-container">
                        <img :src="item.articulo.imagen" :alt="item.articulo.nombre" />
                    </div>

                    <div class="info-articulo">
                        <h3>{{ item.articulo.nombre }}</h3>
                        <p>{{ item.articulo.descripcion }}</p>
                        <p>Precio: ${{ item.articulo.precio }}</p>

                        <div class="cantidad-container">
                            <div class="cantidad">
                                <button class="cantidad-btn" @click="decrementarCantidad(item)"
                                    :disabled="item.cantidad <= 1">
                                    -
                                </button>

                                <input class="cantidad-input" type="number" :value="item.cantidad" :min="1"
                                    :max="item.articulo.stock"
                                    @input="event => cambiarCantidadInput(item, event.target.value)" />

                                <button class="cantidad-btn" @click="incrementarCantidad(item)"
                                    :disabled="item.cantidad >= item.articulo.stock">
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="cantidad-subtotal-text">
                            <p>Subtotal: ${{ item.articulo.precio * item.cantidad }}</p>
                        </div>
                    </div>
                </div>

                <div class="prefactura">
                    <p>Subtotal: ${{ calcularSubtotal() }}</p>
                    <p v-if="descuentoTotal() > 0">Descuento: ${{ descuentoTotal() }}</p>
                    <p>Total: ${{ calcularTotal() }}</p>
                </div>

                <div class="carrito-actions">
                    <button class="icono-boton comprar" @click="mostrarModalConfirmacion = true"
                        :disabled="carritoCompleto.length === 0" aria-label="Comprar ahora">
                        <DollarSign class="icono-btn" />
                    </button>

                    <button class="icono-boton vaciar" @click="vaciarCarrito" :disabled="carritoCompleto.length === 0"
                        aria-label="Vaciar carrito">
                        <Trash2 class="icono-btn" />
                    </button>
                </div>

                <div v-if="pedidoExitoso" class="alert alert-success">
                    {{ mensajePedido }}
                </div>
            </div>
        </div>

        <!-- Modal de confirmación -->
        <div v-if="mostrarModalConfirmacion" class="modal-overlay">
            <div class="modal">
                <h3>Confirmar compra</h3>
                <p>¿Deseas confirmar la compra?</p>
                <div class="modal-buttons">
                    <button @click="confirmarCompra" class="btn-confirmar">Confirmar</button>
                    <button @click="cancelarCompra" class="btn-cancelar">Cancelar</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { DollarSign, Trash2 } from 'lucide-vue-next'
import productosJSON from '@/json/productos.json';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export default {
    name: 'CarritoPage',
    components: {
        DollarSign,
        Trash2
    },
    data() {
        return {
            pedidoExitoso: false,
            mensajePedido: '',
            mostrarModalConfirmacion: false,
        };
    },
    computed: {
        carrito() {
            return this.$store.getters.carrito;
        },
        carritoCompleto() {
            return this.carrito.map(item => {
                const articuloCompleto = productosJSON.find(
                    prod => prod.idproductos === item.articulo.idproductos
                );
                return {
                    cantidad: item.cantidad,
                    articulo: articuloCompleto || item.articulo,
                };
            });
        },
    },
    methods: {
        vaciarCarrito() {
            this.$store.dispatch('vaciarCarrito');
        },
        calcularSubtotal() {
            return this.carritoCompleto.reduce(
                (total, item) => total + item.articulo.precio * item.cantidad,
                0
            );
        },
        descuentoTotal() {
            const subtotal = this.calcularSubtotal();
            const totalItems = this.carritoCompleto.reduce((total, item) => total + item.cantidad, 0);
            return subtotal > 300 && totalItems > 3 ? subtotal * 0.15 : 0;
        },
        calcularTotal() {
            return this.calcularSubtotal() - this.descuentoTotal();
        },
        cambiarCantidadInput(item, value) {
            let cantidad = Number(value);
            if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
            if (cantidad > item.articulo.stock) cantidad = item.articulo.stock;

            this.$store.dispatch('cambiarCantidad', {
                idproducto: item.articulo.idproductos,
                cantidad,
            });
        },
        incrementarCantidad(item) {
            if (item.cantidad < item.articulo.stock) {
                this.$store.dispatch('cambiarCantidad', {
                    idproducto: item.articulo.idproductos,
                    cantidad: item.cantidad + 1,
                });
            }
        },
        decrementarCantidad(item) {
            if (item.cantidad > 1) {
                this.$store.dispatch('cambiarCantidad', {
                    idproducto: item.articulo.idproductos,
                    cantidad: item.cantidad - 1,
                });
            }
        },

        generarPDF() {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Centrar título
            doc.setFontSize(18);
            const title = "Factura de compra";
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, (pageWidth - titleWidth) / 2, 20);

            // Definir columnas de la tabla
            const columns = [
                { header: 'Artículo', dataKey: 'nombre' },
                { header: 'Cantidad', dataKey: 'cantidad' },
                { header: 'Precio Unit.', dataKey: 'precio' },
                { header: 'Subtotal', dataKey: 'subtotal' },
            ];

            // Crear filas con los datos de carrito
            const rows = this.carritoCompleto.map(item => ({
                nombre: item.articulo.nombre,
                cantidad: item.cantidad.toString(),
                precio: `$${item.articulo.precio.toFixed(2)}`,
                subtotal: `$${(item.articulo.precio * item.cantidad).toFixed(2)}`,
            }));

            // Generar tabla con autoTable
            autoTable(doc, {
                startY: 30,
                head: [columns.map(col => col.header)],
                body: rows.map(row => columns.map(col => row[col.dataKey])),
                styles: { fontSize: 11, halign: 'center' },
                headStyles: { fillColor: [110, 27, 147] }, // morado oscuro
                alternateRowStyles: { fillColor: [240, 230, 250] }, // morado claro
                margin: { left: 14, right: 14 },
                columnStyles: {
                    0: { halign: 'left' }, // Nombre alineado a la izquierda
                }
            });

            // Posición para totales (debajo de la tabla)
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(14);

            // Alinear totales a la derecha
            const totalLabels = [];
            totalLabels.push(`Subtotal: $${this.calcularSubtotal().toFixed(2)}`);
            if (this.descuentoTotal() > 0) {
                totalLabels.push(`Descuento: -$${this.descuentoTotal().toFixed(2)}`);
            }
            totalLabels.push(`Total a pagar: $${this.calcularTotal().toFixed(2)}`);

            totalLabels.forEach((text, i) => {
                const textWidth = doc.getTextWidth(text);
                doc.text(text, pageWidth - 14 - textWidth, finalY + i * 8);
            });

            doc.save("factura_compra.pdf");
        },



        confirmarCompra() {
            this.mostrarModalConfirmacion = false;
            if (this.carritoCompleto.length === 0) return;

            this.pedidoExitoso = true;
            this.mensajePedido = '¡Compra completada con éxito!';

            this.generarPDF();  // Primero generar PDF

            this.$store.dispatch('vaciarCarrito');  // Luego vaciar carrito

            setTimeout(() => {
                this.pedidoExitoso = false;
                this.mensajePedido = '';
            }, 4000);
        },


        cancelarCompra() {
            this.mostrarModalConfirmacion = false;
        }
    }
};
</script>

<style scoped src="@/styles/carrito.css"></style>
