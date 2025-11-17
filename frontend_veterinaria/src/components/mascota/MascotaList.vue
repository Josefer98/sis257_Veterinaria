<script setup lang="ts">
import type { Mascota } from '@/models/mascota'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'mascotas'
const mascotas = ref<Mascota[]>([])
const mascotaDelete = ref<Mascota | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const mascotasFiltrados = computed(() => {
  return mascotas.value.filter(
    (mascota) =>
      mascota.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      mascota.raza?.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  mascotas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(mascota: Mascota) {
  emit('edit', mascota)
}

function mostrarEliminarConfirm(mascota: Mascota) {
  mascotaDelete.value = mascota
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${mascotaDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por id o fecha" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre del Cliente</th>
          <th>Nombre de Mascota</th>
          <th>Especie</th>
          <th>Raza</th>
          <th>edad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mascota, index) in mascotasFiltrados" :key="mascota.id">
          <td>{{ index + 1 }}</td>
          <td>{{ mascota.clientes.nombres }}</td>
          <td>{{ mascota.nombre }}</td>
          <td>{{ mascota.especie }}</td>
          <td>{{ mascota.raza }}</td>
          <td>{{ mascota.edad }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(mascota)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(mascota)"
            />
          </td>
        </tr>
        <tr v-if="mascotasFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar la mascota {{ mascotaDelete?.nombre }} ?</p>
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
