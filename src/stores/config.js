import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: {
      nivel: 'Operation',
      // nivel: 'BackOffice',
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
