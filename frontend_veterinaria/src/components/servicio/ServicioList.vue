<script setup lang="ts">

import type { Servicio } from '@/models/servicio'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'servicios'
const servicios = ref<Servicio[]>([])
const servicioDelete = ref<Servicio | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const serviciosFiltrados = computed(() => {
  return servicios.value.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      servicio.tipoServicio.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  servicios.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(servicio: Servicio) {
  emit('edit', servicio)
}

function mostrarEliminarConfirm(servicio: Servicio) {
  servicioDelete.value = servicio
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${servicioDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o categoria" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>TipoDeServicio</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(servicio, index) in serviciosFiltrados" :key="servicio.id">
          <td>{{ index + 1 }}</td>
          <td>{{ servicio.nombre }}</td>
          <td>{{ servicio.descripcion }}</td>
          <td>{{ servicio.tipoServicio }}</td>
          <td>{{ servicio.precio }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(servicio)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(servicio)"
            />
          </td>
        </tr>
        <tr v-if="serviciosFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el servicio {{ servicioDelete?.nombre }} ?</p>
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

<style scoped></style>
