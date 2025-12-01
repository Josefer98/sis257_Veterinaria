<script setup lang="ts">
import type { TipoServicio } from '@/models/tipo-servicio'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'tipo-servicios'
const tipoServicios = ref<TipoServicio[]>([])
const tipoServicioDelete = ref<TipoServicio | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const tipoServiciosFiltrados = computed(() => {
  return tipoServicios.value.filter(
    (tipoServicio) =>
      tipoServicio.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

async function obtenerLista() {
  tipoServicios.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(tipoServicio: TipoServicio) {
  emit('edit', tipoServicio)
}

function mostrarEliminarConfirm(tipoServicio: TipoServicio) {
  tipoServicioDelete.value = tipoServicio
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${tipoServicioDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
      </InputGroup>
    </div>

    <table class="styled-table">
      <thead>
        <tr>
          <th><i class="pi pi-hashtag"></i> Nro.</th>
          <th><i class="pi pi-user"></i> Nombre</th>
          <th><i class="pi pi-cog"></i> Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tipoServicio, index) in tipoServiciosFiltrados" :key="tipoServicio.id">
          <td>{{ index + 1 }}</td>
          <td>{{ tipoServicio.nombre }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(tipoServicio)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(tipoServicio)"
            />
          </td>
        </tr>
        <tr v-if="tipoServiciosFiltrados.length === 0">
          <td colspan="9">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el Tipo de Servicio {{ tipoServicioDelete?.nombre }} ?</p>
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
/* ===== CONTENEDOR PRINCIPAL ===== */
.container {
  padding: 20px;
}

/* ===== HEADER CON BÚSQUEDA ===== */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.2);
}

.header-section h2 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

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
  width: 120px;
}

/* Divisiones verticales en el header */
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
}

/* ===== BADGES Y ELEMENTOS ===== */
.nombre-cell {
  font-weight: 600;
  color: #2c3e50;
}

.telefono-cell {
  color: #666;
  font-family: 'Courier New', monospace;
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
  content: '📋';
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .styled-table {
    font-size: 12px;
  }

  .styled-table thead th,
  .styled-table tbody td {
    padding: 12px 10px;
  }
}
</style>
