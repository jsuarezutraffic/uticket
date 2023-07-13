import { boot } from "quasar/wrappers";
import axios from "axios";
import { useMainStore } from "stores/main";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: "https://xzovknjkdfykvximpgxh.supabase.co/rest/v1/",
});
let $q = useQuasar();

export default boot(({ app, router, $Notify }) => {
  const store = useMainStore();
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

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

export { api };
