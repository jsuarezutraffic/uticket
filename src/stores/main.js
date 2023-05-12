import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    token: "",
    isAuthenticated: false,
    TOKEN: "",
  }),
  perfil: () => ({
    imagUser: "",
    nameUser: "",
  }),
  getters: {
    buscarToken: (state) => state.token,
    buscarAutenticado: (state) => state.isAuthenticated,
    buscarIdAplicacion: (state) => state.aplicationId,
  },
  actions: {
    inicio(data) {
      // this.TOKEN = TOKEN;
      console.log(data);
      this.token = data.session.access_token;
      LocalStorage.set("Token", this.token);
      this.isAuthenticated = true;
      // this.perfilId = data.data.id;
      // LocalStorage.set("perfilId", data.data.id);
    },
    iniciosesion(iniSesion) {
      LocalStorage.set("AfterLogin", iniSesion);
      this.isAuthenticated = true;
    },

    datafecha(data) {
      LocalStorage.set("datafecha", data);
      this.isAuthenticated = true;
    },
    borrar() {
      this.token = "";
      // LocalStorage.remove(this.TOKEN);
      sessionStorage.removeItem("__ii");
      // LocalStorage.remove("__idu");
      this.isAuthenticated = false;
      localStorage.clear();
      this.TOKEN = "";
    },

    init() {
      this.TOKEN = "ieroadpassiprevbakopintegrador";
      const token = LocalStorage.getItem("Token");

      if (token) {
        this.token = token;
        this.isAuthenticated = true;

        LocalStorage.set("Token", token);
        api.defaults.headers.common.Authorization = "Bearer " + this.token;
        api.defaults.headers.common.apikey =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0";
      } else {
        this.borrar();
      }
    },
  },
});
