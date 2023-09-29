import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import * as services from "../services/services.js"
import CryptoJS from 'crypto-js';

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
    claveSecreta:'key_secret_uticket_backoffice_bak',
    listUsersSelected:[],
    listNotificaciones:[],
  }),

  getters: {
    buscarToken: (state) => state.token,
    buscarAutenticado: (state) => state.isAuthenticated
  },
  actions: {
    inicio (data) {
      LocalStorage.set("selectFiltro", false);
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
        this.loadGeneralDataLocal()
      } else {
        this.borrar()
      }
    },
    loadGeneralDataLocal (){
      const datosEncriptados = localStorage.getItem('generalData');
      this.generalData = this.descryptptData(datosEncriptados)
    },

    async loadGeneralData  (filtro) {
      let generalData = {}
      await services.getCliente(``).then((response) => {
        generalData.clientes = response.data;
      });
      await services.getConcesion(filtro).then((response) => {
        generalData.concesion = response.data
      })
      await services.getPeaje(filtro).then((response) => {
        generalData.peaje = response.data
      })
      await services.getTipo(filtro).then((response) => {
        generalData.tipo = response.data
      })
      await services.getSubtipo(filtro).then((response) => {
        generalData.subtipo = response.data
      })
      await services.getPrioridad(filtro).then((response) => {
        generalData.prioridad = response.data
      })
      await services.getEstado(filtro).then((response) => {
        generalData.estado = response.data
      })
      await services.getSolicitud(filtro).then((response) => {
        generalData.solicitud = response.data
      })
      await services.getProceso(filtro).then((response) => {
        generalData.proceso = response.data
      })
      await services.getEquipo(filtro).then((response) => {
        generalData.equipo = response.data
      })
      await services.getMetodoConsulta(filtro).then((response) => {
        generalData.metodoconsulta = response.data
      })
      await services.getUsuarios(filtro).then((response) => {
        generalData.usuarios = response.data
      })

      localStorage.setItem('generalData', this.encryptptData(generalData));
      this.generalData = generalData


      // services.getCliente(filtro).then((response) => {
      //   this.generalData.cliente = response.data
      // })
    },

    encryptptData(indata){
      const data = { key: 'encryptdata', secreto: indata };
      const dataString = JSON.stringify(data);
      const datosEncriptados = CryptoJS.AES.encrypt(dataString, this.claveSecreta).toString();
      return datosEncriptados
    },

    descryptptData (indata){
      const bytesDesencriptados = CryptoJS.AES.decrypt(indata, this.claveSecreta);
      const datosDesencriptados = JSON.parse(bytesDesencriptados.toString(CryptoJS.enc.Utf8));
      return datosDesencriptados.secreto
    },
    setListUsersSelected() {
      this.listUsersSelected = []
    },
    setListNotificaciones(accion) {
      if (accion=="INSERT") {
      this.listNotificaciones.push({
        icon:'priority_high',
        mensaje: "Ticket Añadido"
      })
      } else if (accion=="UPDATE") {
        this.listNotificaciones.push({
          icon:'warning',
          mensaje: "Ticket Actualizado"
        })
        } else if('clear'){
        this.listNotificaciones = []
      }
    },
  }
})
