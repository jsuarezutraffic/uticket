import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";
const URL = process.env.API_URL;
const api = axios.create({ baseURL: URL });

export default boot(({ app, router, store }) => {
  api.defaults.baseURL = URL;
  axios.defaults.baseURL = URL;

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
