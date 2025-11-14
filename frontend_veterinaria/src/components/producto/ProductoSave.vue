<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: producto.value.nombre,
      categoria: producto.value.categoria,
      descripcion: producto.value.descripcion,
      precio: producto.value.precio,
      stock: producto.value.stock,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="producto.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="categoria" class="font-semibold w-3">Categoria</label>
        <InputText
          id="categoria"
          v-model="producto.categoria"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripcion</label>
        <InputText
          id="descripcion"
          v-model="producto.descripcion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3">Precio</label>
        <InputNumber
          id="precio"
          v-model="producto.precio"
          class="flex-auto"
          autocomplete="off"
          mode="decimal"
          :min-fraction-digits="2"
          :max-fraction-digits="2"      
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-3">Stock</label>
        <InputNumber
          id="stock"
          v-model="producto.stock"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
