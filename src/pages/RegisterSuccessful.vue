<template>
  <div class="success-message">
    <div class="card">
      <h1>Registro exitoso</h1>
      <p>{{ mensaje }}</p>
    </div>
  </div>

  <div
    style="
      position: fixed;
      height: 100%;
      width: 100%;
      left: 0;
      bottom: 0;
      z-index: -1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #31d3ae;
    "
    v-if="false"
  >
    <q-card class="q-ma-md q-pa-md" style="width: 30%">
      <div class="row">
        <div
          class="col-md-12 col-xs-12"
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-img
            src="../assets/C505EF1B-28CA-4FD4-A240-D5AFBBC9989A-removebg.png"
            class="u-trafficRegister"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
const mensaje = "El registro ha sido exitoso";
</script>

<style lang="scss">
.success-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $primary;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}
</style>
