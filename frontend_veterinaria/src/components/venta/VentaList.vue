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
          <th>Nro.</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(venta, index) in ventasFiltrados" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.cliente?.nombres }} {{ venta.cliente?.apellidos }}</td>
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
  </div>
</template>

<style scoped>
/*table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #783505;
}

th {
  background: #95410c;
}*/

.styled-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0 8px; /* separa filas para efecto "tarjeta" */
  font-size: 15px;
  text-align: center;
}

.styled-table thead th {
  background: #f54927;
  color: #fff;
  padding: 12px;
  border: none;
  font-weight: 600;
  text-align: center;
  position: relative;
}

/* Agregamos divisiones verticales */
.styled-table thead th:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 0;
  height: calc(100% - 24px);
  width: 1px;
  background: rgba(255, 255, 255, 0.5);
}

.styled-table tbody tr {
  background: #f2bf5b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition: 0.2s ease;
}

.styled-table tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.styled-table tbody td {
  padding: 12px 14px;
  border: none;
  color: #333;
  text-align: center;
  position: relative;
}

/* Divisiones verticales en filas */
.styled-table tbody td:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 0;
  height: calc(100% - 24px);
  width: 1px;
  background: rgba(0, 0, 0, 0.1);
}

/* Redondear filas */
.styled-table tbody tr td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.styled-table tbody tr td:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

/* Columna de acciones más ordenada */
.acciones {
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

/* Fila sin datos */
.no-data {
  text-align: center;
  background: #f6f6f6;
  color: #555;
  border-radius: 10px;
}
</style>
