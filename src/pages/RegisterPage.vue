<template>
  <!-- <q-page> -->
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
  >
    <q-card class="q-ma-md q-pa-md" style="width: 60%">
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

        <!-- <div class="col-12 bg-red">
          <div>
            <div class="title-class text-h5 text-weight-bold text-uppercase">
              Welcome to
            </div>
            <div class="title-class text-h5 text-weight-bold text-uppercase">
              U-Ticket
            </div>
          </div>
        </div> -->
      </div>
      <q-form @submit.prevent="CreateAccount()" id="form">
        <div class="row q-col-gutter-x-md q-col-gutter-y-md">
          <div class="col-md-6 col-sm-6 col-xs-12">
            <q-card>
              <div class="row">
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

          <div class="col-md-6 col-sm-6 col-xs-12">
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
                  v-model="object.confirmEmail"
                  dense
                  label="Confirm Email"
                  type="email"
                  required
                  class="col-xs-12 q-pa-md"
                />
                <q-input
                  outlined
                  v-model="object.password"
                  dense
                  label="Password"
                  required
                  :type="isPwd ? 'password' : 'text'"
                  class="col-xs-12 q-pa-md"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <q-input
                  outlined
                  v-model="object.confirmPassword"
                  label="Confirm Password"
                  :type="isPwd ? 'password' : 'text'"
                  required
                  dense
                  :rules="rules"
                  class="col-xs-12 q-pa-md"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    /> </template
                ></q-input>
              </div>
            </q-card>
          </div>

          <!-- <div class="title-class text-h6 font-weight-medium text-uppercase">
          One more step...
        </div> -->

          <!-- <p class="text-h6 text-weight-bold register-text text-uppercase">
          You are ready to go!
        </p> -->
          <q-btn class="button-class r bg-dark no-padding" flat type="submit"
            >Create account</q-btn
          >
        </div>
      </q-form>
    </q-card>
  </div>
  <!-- </q-page> -->
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { useQuasar } from "quasar";
import { LocalStorage, date, SessionStorage } from "quasar";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
defineComponent({
  name: "RegisterPage",
});

let $q = useQuasar();
const email = ref("");
const confirmEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const object = ref({});
const rules = ref([(val) => !!val || "Field is required"]);
const Concesiones = ref([]);

const slide = ref("style");
const padding = ref(false);
const isPwd = ref(true);

// eslint-disable-next-line no-unused-vars
const validate = () => {
  if (email.value !== confirmEmail.value) {
    alert("Emails don't match");
    return false;
  }
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match");
    return false;
  }
  return true;
};

const loadData = async () => {
  let { data: concesion, error } = await supabase.from("concesion").select("*");
  Concesiones.value = concesion;
};

const CreateAccount = async () => {
  if (object.value.password == object.value.confirmPassword) {
    console.log(object.value);
    const { data, error } = await supabase.auth.signUp({
      email: object.value.email,
      password: object.value.password,
    });
    console.log(data);
    console.log(error);

    object.value.estado = true;
    object.value.usuario = data.user.id;

    // SessionStorage.set("ClienteCrear", {
    //   correo: object.value.email,
    //   nombres: object.value.name + " " + object.value.lastName,
    //   concesion: object.value.concesion,
    //   estado: true,
    //   usuario: data.user.id,
    //   telefono: object.value.phoneNumber,
    // });

    const { datacliente, errorcliente } = await supabase
      .from("cliente")
      .insert([
        {
          correo: object.value.email,
          nombres: object.value.name + " " + object.value.lastName,
          concesion: object.value.concesion,
          estado: true,
          usuario: data.user.id,
          telefono: object.value.phoneNumber,
        },
      ]);
  } else {
    $q.notify({
      type: "negative",
      message: "Las contraseñas no coinciden, intente de nuevo.",
      timeout: 3000,
    });
  }
  const toPath = "/";
  router.push(toPath);
  $q.notify({
    type: "info",
    message: "Por favor Verifique su correo Electrónico",
    timeout: 5000,
  });
};

onMounted(() => {
  loadData();
});
</script>

<!-- .card-container {
  position: relative;
  top: 15vh;
  margin: 0 auto;
  max-width: 390px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  align-content: center;
  border-radius: 10px;
} -->
