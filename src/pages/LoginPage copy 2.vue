<template>
  <section class="grid grid-cols-2 h-screen">
    <div class="background-style">
      <div class="bg-neutral-950 w-full h-full bg-opacity-10">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <div
            class="w-[30rem] h-[30rem] rounded-full bg-white bg-opacity-80 shadow-xl"
          >
            <img src="../assets/img/logo.png" class="mx-auto mt-[4rem]" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-full h-full">
      <div class="flex flex-col justify-start">
        <div class="flex flex-row justify-center items-center gap-12 mb-5">
          <img
            src="../assets/img/logo-ie-header.png"
            alt="ie logo"
            class="w-[50px] h-[50px]"
          />
          <img
            src="../assets/img/logo.png"
            alt="ie logo"
            class="w-fit h-fit max-w-[40px] max-h-[60px]"
          />
        </div>

        <h1 class="text-bold text-5xl leading-2 tracking-wide">
          Welcome to
          <strong class="text-emerald-300">Utraffic</strong>
          <br />
          Sign In to Continue.
        </h1>
      </div>

      <div class="mt-6">
        <p>
          Don't have an account?
          <a href="" class="underline underline-offset-2 font-semibold"
            >Create a account</a
          >
        </p>
        <p>It takes less than a minute.</p>
      </div>

      <div class="mt-6">
        <form>
          <div class="flex flex-col justify-center align-start">
            <label for="email">Email</label>
            <input
              class="w-[20rem] border px-2 py-1 m-1 focus:outline focus:outline-emerald-400 focus:rounded focus:outline-2"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
            />

            <label for="password" class="mt-5">Password</label>
            <input
              class="w-[20rem] border px-2 py-1 m-1 focus:outline focus:outline-emerald-400 focus:rounded focus:outline-2"
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />

            <button
              type="submit"
              class="w-full mt-8 py-2 px-1 bg-emerald-300 rounded-full transition-all duration-300 ease-in-out hover:bg-emerald-400 hover:transition-all hover:ease-in-out hover:duration-300"
            >
              Sign In
            </button>

            <button
              type="submit"
              class="w-full mt-4 py-2 px-1 bg-gray-100 rounded-full flex flex-row items-center justify-center gap-3 transition-all ease-in-out duration-300 hover:bg-gray-200 hover:transition-all hover:ease-in-out hover:duration-300"
            >
              <img
                src="../assets/img/buscar.png"
                class="w-[1.3rem] h-[1.3rem]"
              />Sign In with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import { defineComponent, ref } from "vue";
import { createClient } from "@supabase/supabase-js";
import { useMainStore } from "src/stores/main";
import { useConfigStore } from "src/stores/config";
import { api } from "boot/axios";
import { useRouter, useRoute } from "vue-router";
import { mostrarMensajes, getSelectedString } from "boot/global";
import { useQuasar } from "quasar";
// import { supabase } from "../supabase";
// stores
const store = useMainStore();
const config = useConfigStore().config;
let $q = useQuasar();

// supabase
// const supabaseKey = store.supabase_Key;
// const supabaseUrl = store.supabase_Url;
// const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0";

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
  await api
    .post(
      "https://xzovknjkdfykvximpgxh.supabase.co/auth/v1/token?grant_type=password",
      credenciales
    )
    .then((response) => {
      api.defaults.headers.common.Authorization =
        "Bearer " + response.data.access_token;
      api.defaults.headers.common.apikey = supabaseKey;

      api
        .get(`usuarios?id=eq.` + response.data.user.id + `&select=*`)
        .then((response2) => {
          if (response2.data.length > 0) {
            store.inicio(response.data);
            const toPath = `/`;
            router.push(toPath);
          } else {
            $q.notify({
              type: "negative",
              message:
                "No se encuentra registrado en el sistema como un operador",
              timeout: 4000,
            });
          }
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            message:
              "No se encuentra registrado en el sistema como un operador",
            timeout: 4000,
          });
        });
    })
    .catch((error) => {
      mostrarMensajes({
        tipomensaje: 4,
        mensaje:
          "Credensiales invalidas, por favor verificar correo y contraseña",
      });
    });
};
</script>

<style scoped>
.login-btn {
  width: 100px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 30px;
  padding: 10px;
  box-shadow: 0px 2px 5px 0px rgba(110, 110, 110, 1);
}

.background-style {
  background-image: url("/assets/img/backgroundlogin.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
