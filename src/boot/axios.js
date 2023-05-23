import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";
const URL = process.env.API_URL + "/rest/v1/";
const api = axios.create({ baseURL: URL });
export default boot(({ app, router, store }) => {
  api.defaults.baseURL = URL;

  axios.defaults.baseURL = URL;

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response.status == 401) {
        store.borrar();

        router.push("/login");

        Notify.create({
          type: "negative",
          message: "La Sesión Ha Expirado. Por Favor Ingrese Nuevamente.",
          timeout: 4000,
        });
      } else if (error.response.status == 400) {
        Notify.create({
          type: "negative",
          message:
            error.response.data.message +
            " - Codigo error: " +
            error.response.data.code,
          timeout: 4000,
        });
      } else if (error.response.status == 500) {
        Notify.create({
          type: "negative",
          message: "Por Favor Intente Nuevamente",
          timeout: 4000,
        });
      }
      // else if (error.response.status == 409) {
      //   mostrarMensajes({
      //     tipomensaje: 3,
      //     nombretipomensaje: "warning",
      //     mensaje: error.response.data.mensaje,
      //   });
      // } else if (error.response.status == 500) {
      //   mostrarMensajes({
      //     tipomensaje: 4,
      //     nombretipomensaje: "error",
      //     mensaje: "Por Favor Intente Nuevamente",
      //   });

      // } else if (error.response.status == 409) {
      //   mostrarMensajes(error.response.data);
      // }
      return Promise.reject(error);
    }
  );
});

export { axios, api };
