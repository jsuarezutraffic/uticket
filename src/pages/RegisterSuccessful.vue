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
      <q-form @submit.prevent="CreateAccount()" id="form">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <q-card>
              <div class="row">
                <q-input
                  outlined
                  v-model="object.email"
                  label="Email"
                  type="email"
                  required
                  dense
                  class="col-xs-12 q-pa-md"
                />
                <q-input
                  outlined
                  v-model="object.name"
                  label="Name"
                  dense
                  type="text"
                  required
                  class="col-xs-12 q-pa-md"
                  lazy-rules
                />
                <q-input
                  outlined
                  dense
                  v-model="object.lastName"
                  label="Last Name"
                  type="text"
                  required
                  class="col-xs-12 q-pa-md"
                />
                <q-input
                  v-model="object.phoneNumber"
                  label="Phone"
                  mask="(###) ### - ####"
                  unmasked-value
                  required
                  dense
                  class="col-xs-12 q-pa-md"
                  outlined
                />
                <q-select
                  outlined
                  v-model="object.concesion"
                  label="Concesion"
                  :rules="rules"
                  class="col-xs-12 q-pa-md"
                  dense
                  :options="Concesiones"
                  option-label="nombre"
                  option-value="id"
                  emit-value
                  map-options
                  lazy-rules
                />
              </div>
            </q-card>
          </div>

          <q-btn class="button-class r bg-dark no-padding" flat type="submit"
            >Create account</q-btn
          >
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { LocalStorage, date, SessionStorage } from "quasar";
import { defineComponent, ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { api } from "boot/axios";
var url = window.location.href;

const token = url.split("=")[1].slice(0, -11);

const apiUrl = "https://xzovknjkdfykvximpgxh.supabase.co/rest/v1/cliente";
const accessToken = token;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0";

const mensaje = "El registro ha sido exitoso";
const object = ref({});
const rules = ref([(val) => !!val || "Field is required"]);
const isPwd = ref(true);
const Concesiones = ref([]);
// const cliente = SessionStorage.getItem("ClienteCrear");

// const loadData = async () => {
//   let { data: concesion, error } = await supabase.from("concesion").select("*");
//   Concesiones.value = concesion;
// };

// const createClient = () => {

//   api
//     .post("cliente", object, { headers })
//     .then((response) => {
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
// onMounted(() => {
//   loadData();
// });
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
