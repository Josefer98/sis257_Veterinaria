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
  detalles.value = await http.get(`detalle-ventas/venta/${venta.id}`).then((res) => res.data)

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
          <th><i class="pi pi-hashtag"></i> Nro.</th>
          <th><i class="pi pi-user"></i> Cliente</th>
          <th><i class="pi pi-user"></i> Detalle De Venta</th>
          <th><i class="pi pi-calendar"></i> Fecha</th>
          <th><i class="pi pi-money-bill"></i> Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(venta, index) in ventasFiltrados" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.cliente?.nombres }} {{ venta.cliente?.apellidos }}</td>
          <td>
            <Button
              label="ver detalle"
              icon="pi pi-eye"
              severity="info"
              @click="verDetalle(venta)"
            />
          </td>
          <td>{{ formatearFecha(venta.fecha) }}</td>
          <td>{{ venta.total }} BS</td>
        </tr>

        <tr v-if="ventasFiltrados.length === 0">
          <td colspan="6">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <!-- Confirmación de Eliminación -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>
        ¿Estás seguro de que deseas eliminar la venta
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

    <Dialog
      v-model:visible="mostrarDetalleDialog"
      header="Detalle de la Venta"
      :style="{ width: '45rem', color: '#27ae60' }"
    >
      <div v-if="ventaDetalle">
        <p style="color: white">
          <b style="color: #ff6f61">Cliente:</b> {{ ventaDetalle.cliente?.nombres }}
          {{ ventaDetalle.cliente?.apellidos }}
        </p>
        <p style="color: white">
          <b style="color: #ff6f61">Fecha:</b> {{ formatearFecha(ventaDetalle.fecha) }}
        </p>
        <p style="color: white"><b style="color: #ff6f61">Total:</b> {{ ventaDetalle.total }} Bs</p>

        <h4 class="mt-3" style="color: #27ae60">Items de la venta</h4>

        <table class="styled-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Cant.</th>
              <th>Precio</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in detalles" :key="item.id">
              <!-- Tipo item -->
              <td>
                {{ item.idProducto ? 'producto' : 'servicio' }}
              </td>
              <td>
                <span v-if="item.tipoItem === 'producto' && item.producto">
                  {{ item.producto.nombre }}
                </span>

                <span v-else-if="item.tipoItem === 'servicio' && item.servicio">
                  {{ item.servicio.nombre }}
                </span>

                <span v-else> Desconocido </span>
              </td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.precioUnitario }} Bs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mt-3">
        <Button label="Cerrar" @click="mostrarDetalleDialog = false" />
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

/* ===== BOTONES DE ACCIÓN ===== */
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

/* ===== ESTADO VACÍO ===== */
.no-data {
  text-align: center;
  padding: 60px 20px !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #6c757d;
  font-style: italic;
  border-radius: 8px;
}

.no-data::before {
  content: '🛒';
  display: block;
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* ===== BÚSQUEDA ===== */
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
</style>
