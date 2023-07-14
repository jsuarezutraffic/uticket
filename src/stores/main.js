import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
const configJson = require("/public/config.json");
export const useMainStore = defineStore('main', {
  state: () => ({
    token: '',
    isAuthenticated: false,
    identificacion: '',
    supabase_Key: configJson.API_KEY,
    supabase_Key_Admi: configJson.API_KEY_ADMI,
    supabase_Url: configJson.API_URL
  }),

  getters: {
    buscarToken: (state) => state.token,
    buscarAutenticado: (state) => state.isAuthenticated
  },
  actions: {
    inicio (data) {
      this.token = data.access_token
      this.isAuthenticated = true
      api.defaults.headers.common = {
        apikey: this.supabase_Key,
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      }
      LocalStorage.set('token', this.token)
      LocalStorage.set('IdUsuario', data.user.id)
      LocalStorage.set("email", data.user.email);

    },

    borrar () {
      LocalStorage.clear()
    },

    init () {
      const token = LocalStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        LocalStorage.set('token', token)
        api.defaults.headers.common.apikey = this.supabase_Key
        api.defaults.headers.common.Authorization = 'Bearer ' + this.token
        // LocalStorage.set("Verificador", []);
      } else {
        this.borrar()
      }
    }
  }
})
