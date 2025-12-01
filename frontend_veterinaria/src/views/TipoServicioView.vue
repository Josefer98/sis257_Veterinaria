<script setup lang="ts">
import TipoServicioList from '@/components/tipoServicio/TipoServicioList.vue'
import TipoServicioSave from '@/components/tipoServicio/TipoServicioSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const tipoServicioListRef = ref<typeof TipoServicioList | null>(null)
const tipoServicioEdit = ref<any>(null)

function handleCreate() {
  tipoServicioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(cliente: any) {
  tipoServicioEdit.value = cliente
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  tipoServicioListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="mx-8 mt-8 md:m-10">
    <h2>Tipo de Servicios</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <TipoServicioList ref="tipoServicioListRef" @edit="handleEdit" />
    <TipoServicioSave
      :mostrar="mostrarDialog"
      :tipoServicio="tipoServicioEdit"
      :modoEdicion="!!tipoServicioEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
