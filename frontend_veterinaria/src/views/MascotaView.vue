<script setup lang="ts">
import MascotaList from '@/components/mascota/MascotaList.vue'
import MascotaSave from '@/components/mascota/MascotaSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const mascotaListRef = ref<typeof MascotaList | null>(null)
const mascotaEdit = ref<any>(null)

function handleCreate() {
  mascotaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(mascota: any) {
  mascotaEdit.value = mascota
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  mascotaListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="mx-8 mt-8 md:m-10">
    <h2>Mascotas</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <MascotaList ref="mascotaListRef" @edit="handleEdit" />
    <MascotaSave
      :mostrar="mostrarDialog"
      :mascota="mascotaEdit"
      :modoEdicion="!!mascotaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
