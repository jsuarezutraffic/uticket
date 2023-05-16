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
      />
      <q-btn class="login-btn bg-dark no-padding" flat @click="IniciarSesion()"
        >Login</q-btn
      >
    </q-card>

    {{ datos }}
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useMainStore } from 'src/stores/main'
import { useConfigStore } from 'src/stores/config'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
// import { supabase } from "../supabase";
// stores
const store = useMainStore()
const config = useConfigStore().config

// supabase
const supabaseKey = store.supabase_Key
const supabaseUrl = store.supabase_Url
const supabase = createClient(supabaseUrl, supabaseKey)

const datos = ref(null)
const router = useRouter()
defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'LoginPage'
})
const username = ref('')
const password = ref('')
console.log(config)
const IniciarSesion = async () => {
  // eslint-disable-next-line no-unused-vars
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username.value,
    password: password.value
  })
  const toPath = `/${config.nivel}/index`
  router.push(toPath)
  store.inicio(data)
}

// eslint-disable-next-line no-unused-vars
const prueba = async () => {
  api.get('tiquete?select=*').then((response) => {
    console.log(response.data)
  })
}
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
