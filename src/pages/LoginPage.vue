<template>
  <div class="row justify-center text-center items-center">
    <div
      class="col-md-6 col-lg-6 col-sm-12 col-xs-12 movil background-style window-height"
    >
      <div class="div-redondo text-center shadow-5">
        <q-img
          class="q-pa-xs"
          fit="scale-down"
          height="21rem"
          src="../assets/img/LogoUticket.png"
        />
      </div>
    </div>
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12 text-center login">
      <div class="row justify-center">
        <div class="col-6 items-end">
          <q-img
            class="img-utraffic"
            alt="Proyecto"
            src="../assets/img/LogoUtraffic.png"
            fit="contain"
            spinner-color="white"
            width="10rem"
            height="10rem"
          ></q-img>

          <!-- tamaño pequeño -->
          <q-img
            class="img-uticket"
            alt="Proyecto"
            src="../assets/img/LogoUticket.png"
            fit="contain"
            spinner-color="white"
            width="10rem"
            height="10rem"
          ></q-img>
        </div>
      </div>
      <div class="row text-center q-pa-md">
        <div class="col-12 text-center">
          <div class="text-h4 text-weight-bold">
            Welcome to
            <strong class="text-tertiary text-h4 text-weight-bold"
              >U-Ticket -
              <div v-if="configJson.nivel == 1">BackOffice</div>
              <div v-if="configJson.nivel == 2">Operation</div></strong
            ><br />
            <p class="text-h5 text-weight-bold q-pt-lg">
              Inicia sesión para continuar.
            </p>
          </div>
        </div>
      </div>

      <div class="column items-center q-pt-md">
        <div class="col text-center">
          <q-form class="form" ref="myForm" @submit.prevent="IniciarSesion()">
            <div class="row">
              <div class="col-12">
                <q-input
                  v-model="username"
                  type="text"
                  :label="'User'"
                  :dense="dense"
                  :rules="[(val) => !!val || 'Required']"
                  lazy-rules
                >
                  <template #prepend>
                    <q-icon name="person"></q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <q-input
                  :type="isPwd ? 'password' : 'text'"
                  :label="'Password'"
                  v-model="password"
                  :dense="dense"
                  :rules="[
                    (val) => !!val || 'Required',
                    (val) => val.length > 2 || 'MinimumCharacter',
                  ]"
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="password" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <q-btn
                  style="width: 100%"
                  color="tertiary"
                  text-color="black"
                  :label="'Login'"
                  type="submit"
                  rounded
                ></q-btn>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>
<script setup>
import { defineComponent, ref } from "vue";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { mostrarMensajes } from "boot/global";
import { useQuasar } from "quasar";
const configJson = require("/public/config.json");
// import { supabase } from "../supabase";
// stores
const store = useMainStore();
const config = useConfigStore().config;
let $q = useQuasar();
const visible = ref(false);
const isPwd = ref(true);
// supabase
const datos = ref(null);
const router = useRouter();
defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "LoginPage",
});
const username = ref("");
const password = ref("");
api.defaults.headers.common.apikey = store.supabase_Key;
const IniciarSesion = async () => {
  const credenciales = {
    email: username.value,
    password: password.value,
  };
  visible.value = true;

  await api
    .post(
      `${store.supabase_Url}/auth/v1/token?grant_type=password`,
      credenciales
    )
    .then((response) => {
      api.defaults.headers.common.Authorization =
        "Bearer " + response.data.access_token;
      api.defaults.headers.common.apikey = store.supabase_Key_Admi;

      api
        .get(`usuarios?id=eq.` + response.data.user.id + `&select=*`)
        .then((response2) => {
          console.log(response2.data);

          if (response2.data.length > 0) {
            async function iniciar(params) {
              await store.inicio(response.data);
              await store.loadGeneralData("");
              const toPath = `/`;
              router.push(toPath);
            }
            if (config.nivelSistema == 1) {
              if (
                response2.data[0].nivel == 1 ||
                response2.data[0].nivel == 3
              ) {
                iniciar();
              } else {
                $q.notify({
                  type: "negative",
                  message: `ESTED NO TIENE ACCESO A BACKOFFICE`,
                  timeout: 4000,
                });
                visible.value = false;
              }
            } else {
              if (
                response2.data[0].nivel == 2 ||
                response2.data[0].nivel == 3 ||
                response2.data[0].nivel == 4
              ) {
                iniciar();
              } else {
                $q.notify({
                  type: "negative",
                  message: `ESTED NO TIENE ACCESO A OPERADOR`,
                  timeout: 4000,
                });
                visible.value = false;
              }
            }
          } else {
            visible.value = false;

            $q.notify({
              type: "negative",
              message:
                "No se encuentra registrado en el sistema como un operador",
              timeout: 4000,
            });
          }
        })
        .catch((error) => {
          visible.value = false;

          $q.notify({
            type: "negative",
            message:
              "No se encuentra registrado en el sistema como un operador",
            timeout: 4000,
          });
        });
    })
    .catch((error) => {
      visible.value = false;

      mostrarMensajes({
        tipomensaje: 4,
        mensaje:
          "Credensiales invalidas, por favor verificar correo y contraseña",
      });
    });
};
</script>
