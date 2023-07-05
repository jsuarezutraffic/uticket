<template>
  <q-layout view="hHh lpr fFf" class="background">
    <q-card class="card-container">
      <q-img
        src="../assets/C505EF1B-28CA-4FD4-A240-D5AFBBC9989A-removebg.png"
        class="u-traffic"
      />
      <div class="card-header">
        <div class="title-class text-h5 text-weight-bold text-uppercase">
          Welcome back to
        </div>
        <div class="title-class text-h5 text-weight-bold text-uppercase">
          U-Ticket
        </div>
      </div>

      <q-input
        outlined
        v-model="username"
        label="Email"
        type="text"
        class="username-box"
        required
      />
      <q-input
        outlined
        v-model="password"
        label="Password"
        type="password"
        class="username-box"
        required
        @keyup.enter="login()"
      />
      <div class="row">
        <div class="col-md-6 col-sm-12 q-pa-md">
          <q-btn class="login-btn bg-dark no-padding" @click="login()" flat
            >Login</q-btn
          >
        </div>
        <div class="col-md-6 col-sm-12 q-pa-md">
          <q-btn
            width="100%"
            class="login-btn bg-primary no-padding"
            to="/register"
            flat
            >Sign Up</q-btn
          >
        </div>
      </div>
    </q-card>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
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

const apiUrl =
  "https://xzovknjkdfykvximpgxh.supabase.co/auth/v1/token?grant_type=password";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0";

const headers = {
  apikey: supabaseKey,
  "Content-Type": "application/json",
};

const username = ref("");
const password = ref("");

const login = async () => {
  api
    .post(
      "https://xzovknjkdfykvximpgxh.supabase.co/auth/v1/token?grant_type=password",
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
            const toPath = "/";
            router.push(toPath);
            store.inicio(response.data);
          } else {
            $q.notify({
              type: "negative",
              message:
                "No se encuentra registrado en el sistema como un cliente",
              timeout: 4000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          $q.notify({
            type: "negative",
            message: "No se encuentra registrado en el sistema como un cliente",
            timeout: 4000,
          });
        });
    })
    .catch((error) => {
      if (error.response.data.error == "invalid_grant") {
        $q.notify({
          type: "negative",
          message: "Credenciales invalidas",
          timeout: 4000,
        });
      } else {
        console.log(error.response.data);
      }
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
</style>
