import { defineStore } from 'pinia'
const configJson = require("/public/config.json");
export const useConfigStore = defineStore('config', {
  state: () => ({
    config: {
      // Operation: 1
      // BackOffice: 2
      // nivel: configJson.nivel,
      UrlApp: 'http://localhost:8080/#'
    }
  }),

  getters: {
    buscarConfig (state) {
      return state.config
    }
  },

  actions: {
    actualizarConfiguracion (value) {
      this.config = value
    }
  }
})
