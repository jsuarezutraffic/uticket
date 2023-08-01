import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import CryptoJS from "crypto-js";
import * as services from "../services/services.js";
const configJson = require("/public/config.json");

export const useMainStore = defineStore("main", {
  state: () => ({
    token: "",
    isAuthenticated: false,
    TOKEN: "",
    supabase_Key: configJson.API_KEY,
    supabase_Key_Admi: configJson.API_KEY_ADMI,
    supabase_Url: configJson.API_URL,
    generalData: {},
    claveSecreta: "key_secret_uticket_backoffice_bak",
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
      this.token = data.access_token;
      LocalStorage.set("Token", this.token);
      this.isAuthenticated = true;
      LocalStorage.set("IdUsuario", data.user.id);
      LocalStorage.set("email", data.user.email);
    },
    inicioCliente(data) {
      LocalStorage.set("admi", data.admi);
    },
    borrar() {
      this.token = "";
      sessionStorage.removeItem("__ii");
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
        this.loadGeneralDataLocal();
      } else {
        this.borrar();
      }
    },

    loadGeneralDataLocal() {
      const datosEncriptados = localStorage.getItem("generalData");
      this.generalData = this.descryptptData(datosEncriptados);
    },

    async loadGeneralData(filtro) {
      let generalData = {};
      await services.getCliente(``).then((response) => {
        generalData.clientes = response.data;
      });
      await services
        .getCliente(`usuario=eq.${LocalStorage.getItem("IdUsuario")}&`)
        .then((response) => {
          generalData.cliente = response.data;
        });
      await services
        .getConcesion(`id=eq.${generalData.cliente[0].concesion}&`)
        .then((response) => {
          generalData.concesion = response.data;
        });
      await services
        .getPeaje(`concesion=eq.${generalData.concesion[0].id}&`)
        .then((response) => {
          generalData.peaje = response.data;
        });
      await services.getTipo("").then((response) => {
        generalData.tipo = response.data;
      });
      await services.getSubtipo("").then((response) => {
        generalData.subtipo = response.data;
      });
      await services.getPrioridad("").then((response) => {
        generalData.prioridad = response.data;
      });
      await services.getEstado("").then((response) => {
        generalData.estado = response.data;
      });
      await services.getSolicitud("").then((response) => {
        generalData.solicitud = response.data;
      });
      await services.getProceso("").then((response) => {
        generalData.proceso = response.data;
      });
      await services.getEquipo("").then((response) => {
        generalData.equipo = response.data;
      });
      await services.getMetodoConsulta("").then((response) => {
        generalData.metodoconsulta = response.data;
      });
      await services.getUsuarios("").then((response) => {
        generalData.usuario = response.data;
      });
      localStorage.setItem("generalData", this.encryptptData(generalData));
      this.generalData = generalData;
    },

    encryptptData(indata) {
      const data = { key: "encryptdata", secreto: indata };
      const dataString = JSON.stringify(data);
      const datosEncriptados = CryptoJS.AES.encrypt(
        dataString,
        this.claveSecreta
      ).toString();
      return datosEncriptados;
    },

    descryptptData(indata) {
      const bytesDesencriptados = CryptoJS.AES.decrypt(
        indata,
        this.claveSecreta
      );
      const datosDesencriptados = JSON.parse(
        bytesDesencriptados.toString(CryptoJS.enc.Utf8)
      );
      return datosDesencriptados.secreto;
    },
  },
});
