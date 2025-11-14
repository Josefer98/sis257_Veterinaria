<script setup lang="ts">

import FacturaProductoList from '@/components/facturaProducto/FacturaProductoList.vue'
import FacturaProductoSave from '@/components/facturaProducto/FacturaProductoSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const facturaProductoListRef = ref<typeof FacturaProductoList | null>(null)
const facturaProductoEdit = ref<any>(null)

function handleCreate() {
  facturaProductoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(venta: any) {
  facturaProductoEdit.value = venta
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  facturaProductoListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Factura de Productos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <FacturaProductoList ref="facturaProductoListRef" @edit="handleEdit" />
    <FacturaProductoSave
      :mostrar="mostrarDialog"
      :venta="facturaProductoEdit"
      :modoEdicion="!!facturaProductoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
