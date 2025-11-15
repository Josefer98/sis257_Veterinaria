<script setup lang="ts">
import type { Servicio } from '@/models/servicio'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'servicios'
const props = defineProps({
  mostrar: Boolean,
  servicio: {
    type: Object as () => Servicio,
    default: () => ({}) as Servicio,
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

const servicio = ref<Servicio>({ ...props.servicio })
watch(
  () => props.servicio,
  (newVal) => {
    servicio.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: servicio.value.nombre,
      descripcion: servicio.value.descripcion,
      tipoServicio: servicio.value.tipoServicio,
      precio: servicio.value.precio,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${servicio.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    servicio.value = {} as Servicio
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
          v-model="servicio.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">descripcion</label>
        <InputText
          id="descripcion"
          v-model="servicio.descripcion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipoServicio" class="font-semibold w-3">Tipo De Servicio</label>
        <InputText
          id="tipoServicio"
          v-model="servicio.tipoServicio"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3">Precio</label>
        <InputNumber
          id="precio"
          v-model="servicio.precio"
          class="flex-auto"
          autocomplete="off"
          mode="decimal"
          :min-fraction-digits="2"
          :max-fraction-digits="2"      
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
