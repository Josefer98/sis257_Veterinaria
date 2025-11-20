<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const clientesFiltrados = computed(() => {
  return clientes.value.filter(
    (cliente) =>
      cliente.nombres.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o descripcion" />
      </InputGroup>
    </div>

    <table class="styled-table">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Telefono</th>
          <th>Direccion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id">
          <td>{{ index + 1 }}</td>
          <td>{{ cliente.nombres }}</td>
          <td>{{ cliente.apellidos }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>{{ cliente.direccion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(cliente)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(cliente)"
            />
          </td>
        </tr>
        <tr v-if="clientesFiltrados.length === 0">
          <td colspan="9">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el Cliente {{ clienteDelete?.nombres }} ?</p>
      <div class="flex justify-end gap-2">
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
