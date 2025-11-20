<script setup lang="ts">

import ServicioList from '@/components/servicio/ServicioList.vue'
import ServicioSave from '@/components/servicio/ServicioSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const servicioListRef = ref<typeof ServicioList | null>(null)
const servicioEdit = ref<any>(null)

function handleCreate() {
  servicioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(servicio: any) {
  servicioEdit.value = servicio
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  servicioListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="mx-8 mt-8 md:m-10"> 
    <h2>Servicios</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <ServicioList ref="servicioListRef" @edit="handleEdit" />
    <ServicioSave
      :mostrar="mostrarDialog"
      :servicio="servicioEdit"
      :modoEdicion="!!servicioEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
