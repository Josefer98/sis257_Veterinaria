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

// --------------------------------------------------------
// 🔍 FILTRO
// --------------------------------------------------------
const ventasFiltrados = computed(() => {
  const query = busqueda.value.toLowerCase()

  return ventas.value.filter((v) => {
    return (
      v.id?.toString().includes(query) ||
      String(v.fecha ?? '').toLowerCase().includes(query) ||
      v.cliente?.nombres?.toLowerCase().includes(query) ||
      v.cliente?.apellidos?.toLowerCase().includes(query) ||
      v.cliente?.telefono?.toLowerCase().includes(query)
    )
  })
})

// --------------------------------------------------------
// 📌 OBTENER LISTA
// --------------------------------------------------------
async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then((r) => r.data)
}

// --------------------------------------------------------
// ✏️ EDITAR
// --------------------------------------------------------
function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

// --------------------------------------------------------
// 🗑️ ELIMINAR
// --------------------------------------------------------
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
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por id, cliente o fecha" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(venta, index) in ventasFiltrados" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.cliente?.nombres }} {{ venta.cliente?.apellidos }}</td>
          <td>{{ formatearFecha(venta.fecha) }}</td>
          <td>{{ venta.total }} BS</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(venta)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(venta)"
            />
          </td>
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
        <b>#{{ ventaDelete?.id }}</b> del cliente
        <b>{{ ventaDelete?.cliente?.nombres }}</b>?
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
  </div>
</template>

<style scoped>
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #057811;
}

th {
  background: #11950c;
}
</style>
