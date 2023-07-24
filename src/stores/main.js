import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import * as services from "../services/services.js"
const configJson = require("/public/config.json");
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMzMjI2NjQsImV4cCI6MTk5ODg5ODY2NH0.T8e5NRSrWYRvKs0qBrOBqAxm0mNS5yOu9Oei-sCtkMk"
const API_KEY_ADMI = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0"
const API_URL = "https://xzovknjkdfykvximpgxh.supabase.co"

//// Base datos dev
// const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbG9tdmhvd2RpaXJ2b3Rsc2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg2NTY3MDQsImV4cCI6MjAwNDIzMjcwNH0.xMsLpf3hx5Ok-mjqZ4H9weKTZMd9fWu4HQdsd2zGxiE"
// const API_KEY_ADMI = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbG9tdmhvd2RpaXJ2b3Rsc2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODY1NjcwNCwiZXhwIjoyMDA0MjMyNzA0fQ.tT2lgZy9E03dD8F8JnO2cjvUkQpL-bHZ7CnaLS-25a0"
// const API_URL = "https://welomvhowdiirvotlsfa.supabase.co"
export const useMainStore = defineStore('main', {
  state: () => ({
    token: '',
    isAuthenticated: false,
    identificacion: '',
    supabase_Key: API_KEY,
    supabase_Key_Admi: API_KEY_ADMI,
    supabase_Url: API_URL,
    url_bak: configJson.API_URL_BAK,
    url_cus: configJson.API_URL_CUS,
    generalData: {},
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
      console.log('init')
      const token = LocalStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        LocalStorage.set('token', token)
        api.defaults.headers.common.apikey = this.supabase_Key
        api.defaults.headers.common.Authorization = 'Bearer ' + this.token
        this.loadGeneralData('')
      } else {
        this.borrar()
      }
    },


    loadGeneralData  (filtro) {
      services.getConcesion(filtro).then((response) => {
        this.generalData.concesion = response.data
      })
      services.getPeaje(filtro).then((response) => {
        this.generalData.peaje = response.data
      })
      services.getTipo(filtro).then((response) => {
        this.generalData.tipo = response.data
      })
      services.getSubtipo(filtro).then((response) => {
        this.generalData.subtipo = response.data
      })
      services.getPrioridad(filtro).then((response) => {
        this.generalData.prioridad = response.data
      })
      services.getEstado(filtro).then((response) => {
        this.generalData.estado = response.data
      })
      services.getSolicitud(filtro).then((response) => {
        this.generalData.solicitud = response.data
      })
      services.getProceso(filtro).then((response) => {
        this.generalData.proceso = response.data
      })
      services.getEquipo(filtro).then((response) => {
        this.generalData.equipo = response.data
      })
      services.getMetodoConsulta(filtro).then((response) => {
        this.generalData.metodoconsulta = response.data
      })

      services.getUsuarios(filtro).then((response) => {
        this.generalData.usuarios = response.data
      })
      services.getCliente(filtro).then((response) => {
        this.generalData.cliente = response.data
      })
    },
  }
})
