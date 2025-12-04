<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'ventas'
const ventas = ref<Venta[]>([])
const ventaDelete = ref<Venta | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

const emit = defineEmits(['edit'])

const ventasFiltrados = computed(() => {
  const query = busqueda.value.toLowerCase()

  return ventas.value.filter((v) => {
    return (
      v.id?.toString().includes(query) ||
      String(v.fecha ?? '')
        .toLowerCase()
        .includes(query) ||
      v.cliente?.nombres?.toLowerCase().includes(query) ||
      v.cliente?.apellidos?.toLowerCase().includes(query) ||
      v.cliente?.telefono?.toLowerCase().includes(query)
    )
  })
})

async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then((r) => r.data)
}

function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

function mostrarEliminarConfirm(venta: Venta) {
  ventaDelete.value = venta
  mostrarConfirmDialog.value = true
}
function formatearFecha(fecha?: string | Date | null) {
  if (!fecha) return ''
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  return d.toLocaleDateString('es-BO') // dd/mm/aaaa
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${ventaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })

const ventaDetalle = ref<Venta | null>(null)
const mostrarDetalleDialog = ref(false)
const detalles = ref<any[]>([])

async function verDetalle(venta: Venta) {
  ventaDetalle.value = venta

  // Obtener los detalles desde el backend
  const detallesRaw = await http.get(`detalle-ventas/venta/${venta.id}`).then((res) => res.data)
  
  // Debug: ver qué datos devuelve el backend
  console.log('Detalles de venta (raw):', detallesRaw)

  // Enriquecer los detalles con los nombres de productos/servicios
  const detallesEnriquecidos = await Promise.all(
    detallesRaw.map(async (item: any) => {
      if (item.idProducto) {
        try {
          const producto = await http.get(`productos/${item.idProducto}`).then((res) => res.data)
          return { ...item, producto }
        } catch (error) {
          console.error('Error al obtener producto:', error)
          return item
        }
      } else if (item.idServicio) {
        try {
          const servicio = await http.get(`servicios/${item.idServicio}`).then((res) => res.data)
          return { ...item, servicio }
        } catch (error) {
          console.error('Error al obtener servicio:', error)
          return item
        }
      }
      return item
    })
  )

  detalles.value = detallesEnriquecidos
  console.log('Detalles enriquecidos:', detalles.value)

  mostrarDetalleDialog.value = true
}
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por id, cliente o fecha" />
      </InputGroup>
    </div>

    <table class="styled-table">
      <thead>
        <tr>
          <th class="text-center"><i class="pi pi-hashtag"></i> Nro.</th>
          <th class="text-center"><i class="pi pi-user"></i> Cliente</th>
          <th class="text-center"><i class="pi pi-user"></i> Detalle De Venta</th>
          <th class="text-center"><i class="pi pi-calendar"></i> Fecha</th>
          <th class="text-center"><i class="pi pi-money-bill"></i> Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(venta, index) in ventasFiltrados" :key="venta.id">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">{{ venta.cliente?.nombres }} {{ venta.cliente?.apellidos }}</td>
          <td class="text-center">
            <Button
              label="ver detalle"
              icon="pi pi-eye"
              severity="info"
              @click="verDetalle(venta)"
            />
          </td>
          <td class="text-center">{{ formatearFecha(venta.fecha) }}</td>
          <td class="text-center">{{ venta.total }} BS</td>
        </tr>

        <tr v-if="ventasFiltrados.length === 0">
          <td colspan="6">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <!-- ConfirmaciÃ³n de EliminaciÃ³n -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar EliminaciÃ³n"
      :style="{ width: '25rem' }"
    >
      <p>
        Â¿EstÃ¡s seguro de que deseas eliminar la venta
        <b>#{{ ventaDelete?.id }}</b> del cliente <b>{{ ventaDelete?.cliente?.nombres }}</b
        >?
      </p>

      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>

    <!-- Dialog de Detalle de Venta - Diseño Profesional -->
    <Dialog
      v-model:visible="mostrarDetalleDialog"
      :style="{ width: '700px' }"
      modal
      :closable="true"
    >
      <template #header>
        <div class="recibo-header">
          <div class="header-left">
            <i class="pi pi-receipt" style="font-size: 28px; color: #ff6f61;"></i>
            <div>
              <h2 style="margin: 0; color: #2c3e50; font-size: 22px;">Detalle de Venta</h2>
              <span style="color: #7f8c8d; font-size: 14px;">Registro #{{ ventaDetalle?.id }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="ventaDetalle" class="recibo-body">
        <!-- Información del cliente y fecha -->
        <div class="recibo-info-section">
          <div class="info-block">
            <label>Cliente</label>
            <p>{{ ventaDetalle.cliente?.nombres }} {{ ventaDetalle.cliente?.apellidos }}</p>
          </div>
          <div class="info-block">
            <label>Fecha de Venta</label>
            <p>{{ formatearFecha(ventaDetalle.fecha) }}</p>
          </div>
        </div>

        <!-- Divisor -->
        <div class="divider"></div>

        <!-- Tabla de productos/servicios -->
        <div class="recibo-items">
          <h3><i class="pi pi-list"></i> Items de la Venta</h3>
          <table class="recibo-tabla">
            <thead>
              <tr>
                <th class="col-descripcion">Descripción</th>
                <th class="col-cantidad">Cant.</th>
                <th class="col-precio">P. Unit.</th>
                <th class="col-subtotal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detalles" :key="item.id">
                <td class="col-descripcion">
                  <div class="item-descripcion">
                    <span class="item-icon">{{ item.idProducto ? '📦' : '🩺' }}</span>
                    <div class="item-text">
                      <span class="item-nombre">
                        {{ item.producto?.nombre || item.servicio?.nombre || item.descripcion || 'Sin descripción' }}
                      </span>
                      <span class="item-tipo">{{ item.idProducto ? 'Producto' : 'Servicio' }}</span>
                    </div>
                  </div>
                </td>
                <td class="col-cantidad">{{ item.cantidad }}</td>
                <td class="col-precio">Bs. {{ Number(item.precioUnitario).toFixed(2) }}</td>
                <td class="col-subtotal">Bs. {{ (Number(item.precioUnitario) * Number(item.cantidad)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Divisor -->
        <div class="divider"></div>

        <!-- Total -->
        <div class="recibo-total">
         <div class="total-row">
            <span class="total-label">TOTAL</span>
            <span class="total-monto">Bs. {{ Number(ventaDetalle.total).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* ===== TABLA ELEGANTE ===== */
.styled-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: white;
}

.styled-table thead {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
}

.styled-table thead th {
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  position: relative;
}

.styled-table thead th i {
  margin-right: 8px;
  font-size: 16px;
}

.styled-table thead th:first-child {
  text-align: center;
  width: 80px;
}

.styled-table thead th:last-child {
  text-align: center;
  width: 140px;
}

.styled-table thead th:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20%;
  right: 0;
  height: 60%;
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.styled-table tbody tr {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.styled-table tbody tr:hover {
  background: linear-gradient(to right, #fff5f3, #ffffff);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.15);
}

.styled-table tbody tr:last-child {
  border-bottom: none;
}

.styled-table tbody td {
  padding: 16px 20px;
  border: none;
  color: #333;
  text-align: left;
  font-size: 14px;
}

.styled-table tbody td:first-child {
  text-align: center;
  font-weight: 600;
  color: #ff6f61;
  font-size: 15px;
}

.styled-table tbody td:last-child {
  text-align: center;
  font-weight: 600;
  color: #27ae60;
  font-size: 15px;
}

/* ===== BOTONES DE ACCIÃ“N ===== */
.acciones {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}

:deep(.p-button.p-button-text) {
  transition: all 0.2s ease;
}

:deep(.p-button.p-button-text:hover) {
  transform: scale(1.1);
}

:deep(.p-button-icon.pi-pencil) {
  color: #3498db;
}

:deep(.p-button-icon.pi-trash) {
  color: #e74c3c;
}

/* ===== ESTADO VACÃO ===== */
.no-data {
  text-align: center;
  padding: 60px 20px !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #6c757d;
  font-style: italic;
  border-radius: 8px;
}

.no-data::before {
  content: 'ðŸ›’';
  display: block;
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* ===== BÃšSQUEDA ===== */
:deep(.p-inputgroup) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-inputgroup-addon) {
  background: white;
  border: 2px solid #ffd4cc;
  border-right: none;
  color: #ff6f61;
}

:deep(.p-inputtext) {
  border: 2px solid #ffd4cc;
  border-left: none;
  padding: 12px 16px;
  font-size: 14px;
}

:deep(.p-inputtext:focus) {
  border-color: #ff6f61;
  box-shadow: none;
}

/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.styled-table tbody tr {
  animation: fadeIn 0.3s ease;
}

/* ===== ESTILOS SIMPLES PARA DETALLE DE VENTA ===== */
.venta-detalle {
  padding: 0;
}

.venta-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  margin: -20px -20px 20px -20px;
  border-radius: 6px 6px 0 0;
}

.venta-header h3 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.venta-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-weight: 600;
  color: #666;
}

.info-row .value {
  color: #2c3e50;
  font-weight: 500;
}

.items-venta h4 {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.tabla-items {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.tabla-items thead {
  background: #f8f9fa;
}

.tabla-items th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid #dee2e6;
}

.tabla-items tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.tabla-items tbody tr:hover {
  background: #f8f9fa;
}

.tabla-items td {
  padding: 12px;
  font-size: 14px;
  color: #2c3e50;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-type {
  font-size: 18px;
}

.venta-total {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  border: 2px solid #27ae60;
}

.total-label {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: #27ae60;
}

.text-muted {
  color: #95a5a6;
  font-style: italic;
}

/* ===== ESTILOS PROFESIONALES PARA DETALLE DE VENTA (RECIBO) ===== */
.recibo-header .header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.recibo-body {
  padding: 4px 0;
}

.recibo-info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.info-block label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #7f8c8d;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.info-block p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #dee2e6, transparent);
  margin: 20px 0;
}

.recibo-items h3 {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recibo-items h3 i {
  color: #ff6f61;
}

.recibo-tabla {
  width: 100%;
  border-collapse: collapse;
}

.recibo-tabla thead {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
  border-bottom: 2px solid #ff6f61;
}

.recibo-tabla th {
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recibo-tabla th.col-cantidad,
.recibo-tabla th.col-precio {
  text-align: center;
}

.recibo-tabla th.col-subtotal {
  text-align: right;
}

.recibo-tabla tbody tr {
  border-bottom: 1px solid #f1f3f5;
  transition: background 0.2s ease;
}

.recibo-tabla tbody tr:hover {
  background: #f8f9fa;
}

.recibo-tabla td {
  padding: 14px 12px;
  font-size: 14px;
  color: #2c3e50;
}

.item-descripcion {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-nombre {
  font-weight: 500;
  color: #2c3e50;
}

.item-tipo {
  font-size: 11px;
  color: #868e96;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.col-cantidad {
  text-align: center;
  font-weight: 600;
}

.col-precio {
  text-align: center;
  color: #495057;
}

.col-subtotal {
  text-align: right;
  font-weight: 700;
  color: #27ae60;
}

.recibo-total {
  background: linear-gradient(135deg, #fff5f3 0%, #ffe8e5 100%);
  padding: 20px 24px;
  border-radius: 8px;
  margin-top: 20px;
  border: 2px solid #ff6f61;
  box-shadow: 0 2px 8px rgba(255, 111, 97, 0.15);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 1px;
}

.total-monto {
  font-size: 28px;
  font-weight: 700;
  color: #27ae60;
}

.recibo-footer {
  display: flex;
  justify-content: flex-end;
}

/* Forzar fondo claro en el dialog - Versión agresiva */
:deep(.p-dialog.p-component) {
  background: white !important;
  color: #2c3e50 !important;
}

:deep(.p-dialog .p-dialog-header) {
  background: white !important;
  color: #2c3e50 !important;
  border-bottom: 1px solid #e9ecef !important;
}

:deep(.p-dialog .p-dialog-title) {
  color: #2c3e50 !important;
}

:deep(.p-dialog .p-dialog-header-icons button) {
  color: #6c757d !important;
}

:deep(.p-dialog .p-dialog-header-icons button:hover) {
  background: #f8f9fa !important;
  color: #2c3e50 !important;
}

:deep(.p-dialog .p-dialog-content) {
  background: white !important;
  color: #2c3e50 !important;
}

:deep(.p-dialog .p-dialog-footer) {
  background: white !important;
  border-top: 1px solid #e9ecef !important;
  padding: 1rem !important;
}

/* Asegurar que todos los elementos internos también sean claros */
:deep(.p-dialog h2),
:deep(.p-dialog h3),
:deep(.p-dialog h4),
:deep(.p-dialog p),
:deep(.p-dialog span),
:deep(.p-dialog label),
:deep(.p-dialog td),
:deep(.p-dialog th) {
  color: inherit !important;
}
</style>
