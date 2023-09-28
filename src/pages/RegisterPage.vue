<template>
  <div class="container-register bg-primary">
    <q-card class="q-ma-md q-pa-lg">
      <div class="row">
        <div class="col-md-12 col-xs-12 center-vertical q-pa-sm">
          <q-img
            fit="scale-down"
            height="9rem"
            src="../assets/img/LogoUticket.png"
            class=""
          />
        </div>
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
          <div class="row q-pt-md" style="width: 100%">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pa-sm">
              <q-btn
                style="width: 100%"
                color="primary"
                text-color="white"
                :label="'Create Cuenta'"
                type="submit"
                rounded
              ></q-btn>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pa-sm">
              <q-btn
                outline
                style="width: 100%"
                color="primary"
                text-color="black"
                :label="'Volver'"
                to="/"
                rounded
              ></q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { useQuasar } from "quasar";
import { LocalStorage, date, SessionStorage } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useMainStore } from "stores/main";
import { api } from "src/boot/axios";
import { postCliente } from "../services/services";
const router = useRouter();
defineComponent({
  name: "RegisterPage",
});

const store = useMainStore();
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
const visible = ref(false);

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
  visible.value = true;

  if (object.value.password != object.value.confirmPassword) {
    visible.value = false;
    $q.notify({
      type: "negative",
      message: "Las contraseñas no coinciden, intente de nuevo.",
      timeout: 3000,
    });
  } else if (object.value.email != object.value.confirmEmail) {
    visible.value = false;
    $q.notify({
      type: "negative",
      message: "La direccion de email no coinciden, intente de nuevo.",
      timeout: 3000,
    });
  } else {
    const headers = {
      apikey: store.supabase_Key_Admi,
      "Content-Type": "application/json",
      Authorization: "Bearer " + store.supabase_Key_Admi,
    };
    api
      .get(
        `${store.supabase_Url}/rest/v1/cliente?correo=eq.${object.value.email}&select=*`,
        { headers }
      )
      .then((response2) => {
        if (response2.data.length > 0) {
          visible.value = false;
          $q.notify({
            type: "negative",
            message: "El correo ya se encuentra registrado en el sistema",
            timeout: 4000,
          });
        } else {
          api
            .post(
              `${store.supabase_Url}/auth/v1/signup`,
              { email: object.value.email, password: object.value.password },
              { headers }
            )
            .then((response) => {
              object.value.usuario = response.data.id;
              api
                .post(
                  `${store.supabase_Url}/rest/v1/cliente`,
                  {
                    correo: object.value.email,
                    nombres: object.value.name + " " + object.value.lastName,
                    concesion: object.value.concesion,
                    estado: false,
                    usuario: object.value.usuario,
                    telefono: object.value.phoneNumber,
                  },
                  { headers }
                )
                .then((response3) => {
                  const toPath = "/";
                  router.push(toPath);
                  $q.notify({
                    type: "info",
                    message:
                      "Registro exitoso, por favor revise su correo electrónico",
                    timeout: 4000,
                  });
                });
            })
            .catch((error) => {
              visible.value = false;
              if (error.response.data.code == 422) {
                $q.notify({
                  type: "negative",
                  message: "La contraseña debe tener mas de 5 caracteres",
                });
              }
            });
        }
      });

    // api
    //   .post(
    //     `${store.supabase_Url}/rest/v1/cliente`,
    //     {
    //       correo: object.value.email,
    //       nombres: object.value.name + " " + object.value.lastName,
    //       concesion: object.value.concesion,
    //       estado: false,
    //       usuario: object.value.usuario,
    //       telefono: object.value.phoneNumber,
    //     },
    //     { headers }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //     api.defaults.headers.common.Authorization =
    //       "Bearer " + response.data.access_token;
    //     api.defaults.headers.common.apikey = store.supabase_Key_Admi;

    //     // object.value.usuario = response.data.id;
    //   });

    // const { datacliente, errorcliente } = await supabase
    //   .from("cliente")
    //   .insert([
    //     {
    //       correo: object.value.email,
    //       nombres: object.value.name + " " + object.value.lastName,
    //       concesion: object.value.concesion,
    //       estado: false,
    //       usuario: object.value.usuario,
    //       telefono: object.value.phoneNumber,
    //     },
    //   ]);
    // console.log(datacliente);
    // console.log(errorcliente);
    // await postCliente({
    //   correo: object.value.email,
    //   nombres: object.value.name + " " + object.value.lastName,
    //   concesion: object.value.concesion,
    //   estado: false,
    //   usuario: data.user.id,
    //   telefono: object.value.phoneNumber,
    // })
    //   .then((response) => {
    //     console.log(response);
    //     const toPath = "/";
    //     router.push(toPath);
    //     $q.notify({
    //       type: "info",
    //       message: "Por favor Verifique su correo Electrónico",
    //       timeout: 5000,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     $q.notify({
    //       type: "negative",
    //       message: "No se encuentra registrado en el sistema como un cliente",
    //       timeout: 4000,
    //     });
    //   });
  }
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss">
.cardMain {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
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
