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
              >U-Ticket</strong
            ><br />
            <p class="text-h5 text-weight-bold q-pt-lg">
              Inicia sesión para continuar.
            </p>
          </div>
        </div>
      </div>

      <div class="column items-center q-pt-md">
        <div class="col text-center">
          <q-form class="form" ref="myForm" @submit.prevent="login()">
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

            <div class="row q-pt-md">
              <div class="col-12 q-pa-sm">
                <q-btn
                  style="width: 100%"
                  color="tertiary"
                  text-color="black"
                  :label="'Login'"
                  type="submit"
                  rounded
                ></q-btn>
              </div>
              <div class="col-12 q-pa-sm">
                <q-btn
                  outline
                  style="width: 100%"
                  color="tertiary"
                  text-color="black"
                  :label="'Registro'"
                  to="/register"
                  rounded
                ></q-btn>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <q-inner-loading
      :showing="visible"
      label="Cargando..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>
<script setup>
import { defineComponent, ref } from "vue";
import { supabase } from "../supabase";
import { useMainStore } from "stores/main";
import { useRouter, useRoute } from "vue-router";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "LoginPage",
});
let $q = useQuasar();
const store = useMainStore();
const router = useRouter();
const isPwd = ref(true);
const visible = ref(false);

const supabaseKey = store.supabase_Key_Admi;
const headers = {
  apikey: supabaseKey,
  "Content-Type": "application/json",
};

const username = ref("");
const password = ref("");

const login = async () => {
  visible.value = true;
  api
    .post(
      `${store.supabase_Url}/auth/v1/token?grant_type=password`,
      { email: username.value, password: password.value },
      { headers }
    )
    .then((response) => {
      api.defaults.headers.common.Authorization =
        "Bearer " + response.data.access_token;
      api.defaults.headers.common.apikey = supabaseKey;

      api
        .get(`cliente?usuario=eq.` + response.data.user.id + `&select=*`)
        .then((response2) => {
          if (response2.data.length > 0) {
            if (response2.data[0].estado) {
              async function iniciar(params) {
                await store.inicio(response.data);
                await store.inicioCliente(response2.data[0]);
                await store.loadGeneralData(response2.data[0]);
                // const toPath = "/";
                const toPath = "/tiquetes";
                router.push(toPath);
              }
              iniciar();
            } else {
              visible.value = false;
              $q.notify({
                type: "negative",
                message:
                  "El usuario se encuentra desactivado, por favor comuníquese con el área de soporte. ",
                timeout: 4000,
              });
            }
          } else {
            visible.value = false;
            $q.notify({
              type: "negative",
              message:
                "No se encuentra registrado en el sistema como un cliente",
              timeout: 4000,
            });
          }
        })
        .catch((error) => {
          visible.value = false;
          $q.notify({
            type: "negative",
            message: "No se encuentra registrado en el sistema como un cliente",
            timeout: 4000,
          });
        });
    })
    .catch((error) => {
      visible.value = false;
      if (error.response.data.error_description == "Email not confirmed") {
        $q.notify({
          type: "negative",
          message:
            "Correo no confirmado, por favor revise su correo electronico",
          timeout: 4000,
        });
      }
      if (
        error.response.data.error_description == "Invalid login credentials"
      ) {
        $q.notify({
          type: "negative",
          message:
            "Credensiales invalidas, por favor verificar correo y contraseña",
          timeout: 4000,
        });
      }
    });
};
</script>
