<script setup lang="ts">

import type { FacturaProducto } from '@/models/facturaproducto'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'factura-productos'
const facturaProductos = ref<FacturaProducto[]>([])
const facturaProductoDelete = ref<FacturaProducto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const facturaProductosFiltrados = computed(() => {
  return facturaProductos.value.filter(
    (facturaProducto) =>
      facturaProducto.venta.cliente?.nombreMascota?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      facturaProducto.venta.cliente?.nombres?.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})
//arreglar
async function obtenerLista() {
  facturaProductos.value= await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(facturaProducto: FacturaProducto) {
  emit('edit', facturaProducto)
}

function mostrarEliminarConfirm(facturaProducto: FacturaProducto) {
  facturaProductoDelete.value = facturaProducto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${facturaProductoDelete.value?.id}`)
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
          <th>Cliente</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(facturaProducto, index) in facturaProductosFiltrados" :key="facturaProducto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ facturaProducto.venta.cliente.nombres }}</td>
          <td>{{ facturaProducto.cantidad }}</td>
          <td>{{ facturaProducto.total }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(facturaProducto)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(facturaProducto)"
            />
          </td>
        </tr>
        <tr v-if="facturaProductosFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar la factura de  {{ facturaProductoDelete?.venta.cliente.nombres }} ?</p>
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
