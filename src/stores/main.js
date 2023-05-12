import { defineStore } from "pinia";
// import { LocalStorage } from "quasar";
// import { api } from "src/boot/axios";
// import { loadLocalData } from "boot/global";

export const useMainStore = defineStore("main", {
  state: () => ({
    token: "",
    isAuthenticated: false,
    identificacion: "",
    supabase_Key:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0",
    supabase_Url: "https://xzovknjkdfykvximpgxh.supabase.co",
  }),

  getters: {
    buscarToken: (state) => state.token,
    buscarAutenticado: (state) => state.isAuthenticated,
  },
  actions: {
    inicio(data) {
      this.token = data.token;
      LocalStorage.set("token", this.token);
      this.isAuthenticated = true;
      LocalStorage.set("sesionBlocked", false);
    },

    iniciosesion(iniSesion) {
      LocalStorage.set("AfterLogin", iniSesion);
      this.isAuthenticated = true;
      loadLocalData();
    },
    datafecha(data) {
      LocalStorage.set("datafecha", data);
      this.isAuthenticated = true;
    },
    codemodules(data) {
      LocalStorage.set("codmod", data);
      this.isAuthenticated = true;
    },
    infoTiqAuditables(data) {
      LocalStorage.set("TiqAuditable", data);
      this.isAuthenticated = true;
    },
    infoTiqAuditablesfila(data) {
      LocalStorage.set("TiqAuditablefila", data);
      this.isAuthenticated = true;
    },
    infoTiqDetalle(data) {
      LocalStorage.set("TiqDetalle", data);
      this.isAuthenticated = true;
    },
    infoTiqDetalle1(data) {
      LocalStorage.set("TiqDetalle1", data);
      this.isAuthenticated = true;
    },
    infoTiqDetalle2(data) {
      LocalStorage.set("TiqDetalle2", data);
      this.isAuthenticated = true;
    },
    infoArqueosRecaudador(data) {
      LocalStorage.set("ArqueosRec", data);
      this.isAuthenticated = true;
    },
    infoTiqRecaudador(data) {
      LocalStorage.set("TiqRecaudador", data);
      this.isAuthenticated = true;
    },
    infoTiqRecaudadorfila(data) {
      LocalStorage.set("TiqRecaudadorfila", data);
      this.isAuthenticated = true;
    },
    infoTiqAuditados1(data) {
      LocalStorage.set("TiqAuditados1", data);
      this.isAuthenticated = true;
    },
    infoTiqxRecaudador(data) {
      LocalStorage.set("TiqxRecaudador", data);
      this.isAuthenticated = true;
    },
    infoRetiros(data) {
      LocalStorage.set("Retiros", data);
      this.isAuthenticated = true;
    },
    infoEvasores(data) {
      LocalStorage.set("Evasores", data);
      this.isAuthenticated = true;
    },
    infoEvasores1(data) {
      LocalStorage.set("Evasoresfila", data);
      this.isAuthenticated = true;
    },
    infoNovedades(data) {
      LocalStorage.set("Novedades", data);
      this.isAuthenticated = true;
    },
    infoNovedades1(data) {
      LocalStorage.set("Novedadesfila", data);
      this.isAuthenticated = true;
    },
    concesionparametro(infoconcesion) {
      LocalStorage.set("idconcesion", infoconcesion);
    },
    plazaverpistas(infoplaza) {
      LocalStorage.set("infoplaza", infoplaza);
    },
    infoPista(infopista) {
      LocalStorage.set("infopista", infopista);
    },
    infoTablasGenericas(infoTablasGenericas) {
      LocalStorage.set("infoTablasGenericas", infoTablasGenericas);
    },
    infoTiquetes(infoTiquetes) {
      LocalStorage.set("infoTiquetes", infoTiquetes);
    },
    infoTipoAuditoria(infoTipoAuditoria) {
      LocalStorage.set("infoTipoAuditoria", infoTipoAuditoria);
    },
    infoUsuarios(infoUsuarios) {
      LocalStorage.set("infoUsuarios", infoUsuarios);
    },
    infoRol(infoRol) {
      LocalStorage.set("infoRol", infoRol);
    },
    infoProgramas(infoProgramas) {
      LocalStorage.set("infoProgramas", infoProgramas);
    },
    infoComponentesTarifas(infoComponentesTarifas) {
      LocalStorage.set("infoComponentesTarifas", infoComponentesTarifas);
    },
    infoFormaPagoPlaza(infoFormaPagoPlaza) {
      LocalStorage.set("infoFormaPagoPlaza", infoFormaPagoPlaza);
    },
    infoReporteDefinicion(infoReporteDefinicion) {
      LocalStorage.set("infoReporteDefinicion", infoReporteDefinicion);
    },

    borrarinfoTiquete() {
      // this.token = "";
      // LocalStorage.remove("token");
      // this.isAuthenticated = false;
      // LocalStorage.set("sesionBlocked", false);
      LocalStorage.infoTiqAuditables.clear();
    },

    borrar() {
      // this.token = "";
      // LocalStorage.remove("token");
      // this.isAuthenticated = false;
      // LocalStorage.set("sesionBlocked", false);
      LocalStorage.clear();
    },

    init() {
      const token = LocalStorage.getItem("token");
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        LocalStorage.set("token", token);
        api.defaults.headers.common.Authorization = "Bearer " + this.token;
        LocalStorage.set("Verificador", []);
      } else {
        this.borrar();
      }
    },
  },
});
