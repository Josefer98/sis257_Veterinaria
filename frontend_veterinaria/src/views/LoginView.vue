<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/index'

const usuario = ref('')
const clave = ref('')
const error = ref(false)
const showPassword = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(usuario.value, clave.value).catch(() => (error.value = true))
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

// Inicializar MDB inputs después de montar el componente
onMounted(() => {
  nextTick(() => {
    // Verificar si mdb está disponible
    if (typeof (window as any).mdb !== 'undefined') {
      const inputs = document.querySelectorAll('[data-mdb-input-init]')
      inputs.forEach((input) => {
        new (window as any).mdb.Input(input)
      })
    }
  })
})
</script>

<template>
  <section class="vh-100" style="background-color: #f7dad8">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img
                  src="https://i.pinimg.com/736x/8a/2d/48/8a2d4821efd933f4d7e44d5ac3d85ac9.jpg"
                  alt="login form"
                  class="img-fluid"
                  style="border-radius: 1rem 0 0 1rem"
                />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <form @submit.prevent="onSubmit">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <i class="fas fa-paw fa-2x me-3" style="color: #ff6f61"></i>
                      <span class="h1 fw-bold mb-0">PetCare Veterinaria</span>
                    </div>

                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px; color: #7f8c8d;">
                      Inicia sesión para acceder al sistema de gestión
                    </h5>

                    <div data-mdb-input-init class="form-outline mb-4">
                      <input
                        v-model="usuario"
                        type="text"
                        id="form2Example17"
                        class="form-control form-control-lg"
                        autocomplete="off"
                      />
                      <label class="form-label" for="form2Example17">Usuario</label>
                    </div>

                    <div data-mdb-input-init class="form-outline mb-4 position-relative">
                      <input
                        v-model="clave"
                        :type="showPassword ? 'text' : 'password'"
                        id="form2Example27"
                        class="form-control form-control-lg"
                        autocomplete="new-password"
                      />
                      <label class="form-label" for="form2Example27">Contraseña</label>
                      <i 
                        class="fas position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                        :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                        @click="togglePassword"
                        style="z-index: 10; cursor: pointer; color: #6c757d;"
                      ></i>
                    </div>

                    <!-- Mensaje de error -->
                    <div v-if="error" class="alert alert-danger" role="alert">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Usuario y/o contraseña incorrectos
                    </div>

                    <div class="pt-1 mb-4">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        class="btn btn-dark btn-lg btn-block active"
                        type="submit"
                        data-mdb-button-initialized="true"
                      >
                        Iniciar Sesión
                      </button>
                    </div>

                    <a class="small text-muted" href="#!">¿Olvidaste tu contraseña?</a>
                    <p class="mb-4 pb-lg-2" style="color: #393f81">
                      ¿Problemas para acceder?
                      <a href="mailto:soporte@tuempresa.com" style="color: #393f81"
                        >Contacta a soporte técnico</a
                      >
                    </p>

                    <div class="d-flex justify-content-between align-items-center">
                      <a href="#!" class="small text-muted">
                        <i class="fas fa-book me-1"></i>Manual de administrador
                      </a>
                      <span class="small text-muted">
                        <i class="fas fa-code-branch me-1"></i>v2.0.1
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
