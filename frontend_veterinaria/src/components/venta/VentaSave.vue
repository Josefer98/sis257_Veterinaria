<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
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

async function obtenerCatalogos() {
  productos.value = await http.get('productos').then((res) => res.data)
  servicios.value = await http.get('servicios').then((res) => res.data)
}

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
      obtenerCatalogos()

      if (props.venta?.id) {
        venta.value = { ...props.venta }
        venta.value.idCliente = props.venta.cliente?.id
      } else {
        venta.value = {} as Venta
        items.value = []
        venta.value.fecha = fechaHoyBolivia()
      }
    }
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
      :header="props.modoEdicion ? 'Editar Venta' : 'Crear Venta'"
      style="width: 40rem"
    >
      <!-- CLIENTE -->
      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-3">Cliente</label>
        <Select
          v-model="venta.idCliente"
          :options="clientes"
          optionLabel="labelCliente"
          optionValue="id"
          placeholder="Seleccionar cliente"
          class="flex-auto"
          :filter="true"
        />
        <!-- Botón para abrir diálogo de nuevo cliente -->
        <Button
          icon="pi pi-plus"
          label="Nuevo Cliente"
          class="ml-2"
          @click="clienteDialogVisible = true"
        />
      </div>

      <!-- FECHA -->
      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold w-3">Fecha</label>
        <Calendar v-model="venta.fecha" class="flex-auto" dateFormat="dd/mm/yy" disabled />
      </div>

      <hr class="my-3" />

      <h3 class="text-lg font-bold mb-3 text-white">Agregar Detalle</h3>

      <!-- TIPO -->
      <div class="flex items-center gap-4 mb-4">
        <label class="w-3">Tipo</label>
        <Dropdown
          v-model="nuevoItem.tipoItem"
          :options="[
            { label: 'Producto', value: 'producto' },
            { label: 'Servicio', value: 'servicio' },
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </div>

      <!-- PRODUCTO -->
      <div v-if="nuevoItem.tipoItem === 'producto'" class="flex items-center gap-4 mb-4">
        <label class="w-3">Producto</label>
        <Dropdown
          v-model="nuevoItem.idProducto"
          :options="productos"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccionar producto"
          class="flex-auto"
        />
      </div>

      <!-- SERVICIO -->
      <div v-if="nuevoItem.tipoItem === 'servicio'" class="flex items-center gap-4 mb-4">
        <label class="w-3">Servicio</label>
        <Dropdown
          v-model="nuevoItem.idServicio"
          :options="servicios"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>

      <!-- CANTIDAD -->
      <div class="flex items-center gap-4 mb-4">
        <label class="w-3">Cantidad</label>
        <InputNumber v-model="nuevoItem.cantidad" />
      </div>

      <Button label="Agregar" icon="pi pi-plus" @click="agregarItem" />

      <hr class="my-4" />

      <!-- TABLA DE ITEMS -->
      <h3 class="text-lg font-bold text-white">Items Agregados</h3>

      <table class="w-full mt-2">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Item</th>
            <th>Cant.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td>{{ item.tipoItem }}</td>

            <td>
              {{
                item.tipoItem === 'producto'
                  ? productos.find((p) => p.id === item.idProducto)?.nombre
                  : servicios.find((s) => s.id === item.idServicio)?.nombre
              }}
            </td>

            <td>{{ item.cantidad }}</td>

            <td>
              <Button icon="pi pi-trash" text @click="eliminarItem(i)" />
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td colspan="4" class="text-center">No hay items agregados</td>
          </tr>
        </tbody>
      </table>

      <!-- TOTAL -->
      <div class="flex items-center gap-4 mt-4">
        <label class="font-semibold w-3">Total</label>
        <InputNumber v-model="venta.total" disabled class="flex-auto" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button label="Guardar" icon="pi pi-save" @click="handleSave" />
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

<style scoped></style>
