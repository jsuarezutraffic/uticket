import { boot } from "quasar/wrappers";
import axios from "axios";
import { useMainStore } from "stores/main";
import { useQuasar } from "quasar";
import { Notify } from "quasar";


const configJson = require("/public/config.json");
const URL = configJson.API_URL + "/rest/v1/";
const api = axios.create({ baseURL: URL });
let $q = useQuasar();
export default boot(({ app, router, $Notify }) => {

  const store = useMainStore();

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

        router.push("/login");
        store.borrar();

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
      return Promise.reject(error);
    }
  );
});

export { api };
