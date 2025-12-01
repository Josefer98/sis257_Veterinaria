<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import type { Mascota } from '@/models/mascota'
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Button, Calendar, Dialog, Dropdown, InputNumber, Select } from 'primevue'
import { computed, ref, watch } from 'vue'
import ClienteSave from '../cliente/ClienteSave.vue'

// Importar el componente ClienteSave

const ENDPOINT = 'ventas'

const props = defineProps({
  mostrar: Boolean,
  venta: {
    type: Object as () => Venta,
    default: () => ({}) as Venta,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

/* ============================================================
    DATA
============================================================ */
const clientes = ref<Cliente[]>([])
const mascotas = ref<Mascota[]>([])
const productos = ref<any[]>([])
const servicios = ref<any[]>([])
const items = ref<any[]>([]) // detalles de venta

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const venta = ref<Venta>({ ...props.venta })

// Item temporal para agregar al carrito
const nuevoItem = ref({
  tipoItem: 'producto',
  idProducto: null,
  idServicio: null,
  cantidad: 1,
})

// Control del diálogo para crear cliente
const clienteDialogVisible = ref(false)

/* ============================================================
    LOAD DATA
============================================================ */
async function obtenerClientes() {
  const data = await http.get('clientes').then((res) => res.data)

  clientes.value = data.map((c: Cliente) => ({
    ...c,
    labelCliente: `${c.nombres} ${c.apellidos}`,
  }))
}

async function obtenerMascotas() {
  mascotas.value = await http.get('mascotas').then((res) => res.data)
  console.log('Mascotas cargadas:', mascotas.value)
  console.log('Primera mascota:', mascotas.value[0])
}

async function obtenerCatalogos() {
  productos.value = await http.get('productos').then((res) => res.data)
  servicios.value = await http.get('servicios').then((res) => res.data)
}

const mascotasDelCliente = computed(() => {
  if (!venta.value.idCliente) return []
  
  const clienteId = Number(venta.value.idCliente)
  
  const filtered = mascotas.value.filter((m) => {
    // El backend devuelve el objeto cliente completo en 'clientes', no solo el ID
    const mascotaClienteId = m.clientes?.id || m.idCliente
    return Number(mascotaClienteId) === clienteId
  })
  
  return filtered
})

function fechaHoyBolivia() {
  const hoy = new Date()
  const options: Intl.DateTimeFormatOptions = { timeZone: 'America/La_Paz' }
  const fechaBolivia = new Date(hoy.toLocaleString('en-US', options))
  return fechaBolivia
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerClientes()
      obtenerMascotas()
      obtenerCatalogos()

      if (props.venta?.id) {
        venta.value = { ...props.venta }
        venta.value.idCliente = props.venta.cliente?.id
        venta.value.idMascota = props.venta.mascota?.id
      } else {
        venta.value = {} as Venta
        items.value = []
        venta.value.fecha = fechaHoyBolivia()
      }
    }
  },
)

// Limpiar mascota seleccionada cuando cambia el cliente
watch(
  () => venta.value.idCliente,
  () => {
    venta.value.idMascota = undefined
  },
)

/* ============================================================
    AGREGAR / ELIMINAR ITEMS
============================================================ */
function agregarItem() {
  if (
    (nuevoItem.value.tipoItem === 'producto' && !nuevoItem.value.idProducto) ||
    (nuevoItem.value.tipoItem === 'servicio' && !nuevoItem.value.idServicio)
  ) {
    alert('Seleccione un producto o servicio')
    return
  }

  items.value.push({ ...nuevoItem.value })

  // Reset
  nuevoItem.value = {
    tipoItem: 'producto',
    idProducto: null,
    idServicio: null,
    cantidad: 1,
  }

  calcularTotal()
}

function eliminarItem(i: number) {
  items.value.splice(i, 1)
  calcularTotal()
}

/* ============================================================
    CALCULAR TOTAL
============================================================ */
function calcularTotal() {
  let total = 0

  for (const item of items.value) {
    let precio = 0

    if (item.tipoItem === 'producto') {
      const p = productos.value.find((x) => x.id === item.idProducto)
      precio = Number(p?.precio || 0)
    }

    if (item.tipoItem === 'servicio') {
      const s = servicios.value.find((x) => x.id === item.idServicio)
      precio = Number(s?.precio || 0)
    }

    total += precio * item.cantidad
  }

  venta.value.total = total
}

/* ============================================================
    GUARDAR VENTA
============================================================ */
async function handleSave() {
  try {
    if (items.value.length === 0) {
      alert('Debes agregar al menos un producto o servicio')
      return
    }

    const body = {
      idCliente: venta.value.idCliente,
      idMascota: venta.value.idMascota,
      fecha: venta.value.fecha,
      total: venta.value.total,
      items: items.value,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${venta.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    venta.value = {} as Venta
    items.value = []
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

// Función para actualizar la lista de clientes después de crear uno nuevo
function clienteGuardado(nuevoCliente: Cliente) {
  obtenerClientes().then(() => {
    venta.value.idCliente = nuevoCliente.id
    clienteDialogVisible.value = false
  })
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Venta' : 'Nueva Venta'"
      style="width: 85rem"
      :modal="true"
    >
      <!-- SECCIÓN: INFORMACIÓN DE VENTA -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-user section-icon"></i>
          <h4 class="section-title">Información de la Venta</h4>
        </div>

        <div class="section-content">
          <!-- CLIENTE -->
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-user label-icon"></i>
              Cliente
            </label>
            <div class="input-with-button">
              <Select
                v-model="venta.idCliente"
                :options="clientes"
                optionLabel="labelCliente"
                optionValue="id"
                placeholder="Seleccionar cliente"
                class="flex-auto"
                :filter="true"
              />
              <Button
                icon="pi pi-plus"
                label="Nuevo"
                size="small"
                severity="success"
                @click="clienteDialogVisible = true"
              />
            </div>
          </div>

          <!-- MASCOTA -->
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-heart label-icon"></i>
              Mascota
            </label>
            <Select
              v-model="venta.idMascota"
              :options="mascotasDelCliente"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccionar mascota (opcional)"
              class="flex-auto"
              :disabled="!venta.idCliente"
            />
          </div>

          <!-- FECHA -->
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-calendar label-icon"></i>
              Fecha
            </label>
            <Calendar v-model="venta.fecha" class="flex-auto" dateFormat="dd/mm/yy" disabled />
          </div>
        </div>
      </div>

      <!-- SECCIÓN: AGREGAR ITEMS -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-shopping-cart section-icon"></i>
          <h4 class="section-title">Agregar Items</h4>
        </div>

        <div class="section-content">
          <!-- TIPO Y SELECCIÓN EN UNA FILA -->
          <div class="form-row-inline">
            <div class="form-group">
              <label class="form-label-small">Tipo</label>
              <Dropdown
                v-model="nuevoItem.tipoItem"
                :options="[
                  { label: 'Producto', value: 'producto' },
                  { label: 'Servicio', value: 'servicio' },
                ]"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>

            <!-- PRODUCTO -->
            <div v-if="nuevoItem.tipoItem === 'producto'" class="form-group flex-grow">
              <label class="form-label-small">Producto</label>
              <Dropdown
                v-model="nuevoItem.idProducto"
                :options="productos"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccionar producto"
                class="w-full"
              />
            </div>

            <!-- SERVICIO -->
            <div v-if="nuevoItem.tipoItem === 'servicio'" class="form-group flex-grow">
              <label class="form-label-small">Servicio</label>
              <Dropdown
                v-model="nuevoItem.idServicio"
                :options="servicios"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccionar servicio"
                class="w-full"
              />
            </div>

            <!-- CANTIDAD -->
            <div class="form-group">
              <label class="form-label-small">Cantidad</label>
              <InputNumber v-model="nuevoItem.cantidad" :min="1" class="w-full" />
            </div>

            <!-- BOTÓN AGREGAR -->
            <div class="form-group align-end">
              <Button label="Agregar" icon="pi pi-plus" @click="agregarItem" class="add-button" />
            </div>
          </div>

          <!-- TABLA DE ITEMS AGREGADOS -->
          <div class="items-table-wrapper">
            <h5 class="items-subtitle">Items en carrito</h5>
            <table class="elegant-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in items" :key="i">
                  <td>
                    <span
                      class="badge"
                      :class="item.tipoItem === 'producto' ? 'badge-product' : 'badge-service'"
                    >
                      {{ item.tipoItem === 'producto' ? 'Producto' : 'Servicio' }}
                    </span>
                  </td>
                  <td class="item-name">
                    {{
                      item.tipoItem === 'producto'
                        ? productos.find((p) => p.id === item.idProducto)?.nombre
                        : servicios.find((s) => s.id === item.idServicio)?.nombre
                    }}
                  </td>
                  <td class="text-center">
                    <span class="quantity-badge">{{ item.cantidad }}</span>
                  </td>
                  <td class="text-center">
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      @click="eliminarItem(i)"
                    />
                  </td>
                </tr>

                <tr v-if="items.length === 0">
                  <td colspan="4" class="empty-state">
                    <i class="pi pi-inbox empty-icon"></i>
                    <p>No hay items agregados</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TOTAL -->
        <div class="total-section">
          <label class="total-label">Total:</label>
          <InputNumber
            v-model="venta.total"
            disabled
            mode="currency"
            currency="BOB"
            locale="es-BO"
            class="total-input"
          />
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="action-buttons">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button label="Guardar Venta" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>

    <!-- DIÁLOGO CLIENTE -->
    <ClienteSave
      :mostrar="clienteDialogVisible"
      @guardar="clienteGuardado($event)"
      @close="clienteDialogVisible = false"
    />
  </div>
</template>

<style scoped>
/* ===== SECCIONES CON TARJETAS ===== */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.section-header {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  color: white;
  font-size: 18px;
}

.section-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
}

.section-content {
  padding: 20px;
}

/* ===== FORMULARIOS ===== */
.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.label-icon {
  color: #ff6f61;
  font-size: 16px;
}

.input-with-button {
  display: flex;
  gap: 10px;
  flex: 1;
}

/* ===== FORMULARIO EN LÍNEA (AGREGAR ITEMS) ===== */
.form-row-inline {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
}

.form-group.flex-grow {
  flex: 1;
  min-width: 200px;
}

.form-group.align-end {
  justify-content: flex-end;
}

.form-label-small {
  font-weight: 600;
  color: #555;
  font-size: 13px;
}

.add-button {
  width: 100%;
  min-width: 120px;
}

/* ===== WRAPPER DE TABLA DE ITEMS ===== */
.items-table-wrapper {
  margin-top: 24px;
}

.items-subtitle {
  color: #ff6f61;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px 0;
  padding-left: 4px;
  border-left: 3px solid #ff6f61;
  padding-left: 12px;
}

/* ===== TABLA ELEGANTE ===== */
.table-container {
  padding: 0 20px 20px 20px;
}

.elegant-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.elegant-table thead {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
}

.elegant-table thead th {
  color: white;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.elegant-table thead th:first-child {
  border-top-left-radius: 8px;
}

.elegant-table thead th:last-child {
  border-top-right-radius: 8px;
}

.elegant-table tbody tr {
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.elegant-table tbody tr:hover {
  background-color: #fff5f3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(255, 111, 97, 0.1);
}

.elegant-table tbody tr:last-child {
  border-bottom: none;
}

.elegant-table tbody td {
  padding: 12px 16px;
  color: #333;
  font-size: 14px;
}

.elegant-table tbody td.text-center {
  text-align: center;
}

/* ===== BADGES ===== */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-product {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge-service {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.quantity-badge {
  display: inline-block;
  background-color: #fff3e0;
  color: #e65100;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.item-name {
  font-weight: 500;
  color: #444;
}

/* ===== ESTADO VACÍO ===== */
.empty-state {
  text-align: center;
  padding: 40px 24px !important;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  display: block;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-style: italic;
  font-size: 14px;
}

/* ===== SECCIÓN TOTAL ===== */
.total-section {
  padding: 16px 20px;
  background: linear-gradient(135deg, #fff5f3 0%, #ffe8e5 100%);
  border-top: 2px solid #ff6f61;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.total-label {
  font-size: 18px;
  font-weight: 700;
  color: #ff6f61;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-input {
  min-width: 200px;
  font-size: 18px;
  font-weight: 700;
}

/* ===== BOTONES DE ACCIÓN ===== */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .form-row-inline {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group {
    width: 100%;
  }

  .section-card {
    margin-bottom: 16px;
  }
}
</style>
