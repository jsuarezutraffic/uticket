import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useConfigStore } from "stores/config";
import { useMainStore } from "stores/main";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    const storeConfig = useConfigStore();
    const store = useMainStore();
    let nivelUrl = to.fullPath.includes(storeConfig.config.nivel);
    if (
      to.matched.some((record) => record.meta.requireLogin) &&
      !store.isAuthenticated == true
    ) {
      next({
        name: "Login",
        query: { to: to.path },
      });
    } else next();
    // if (nivelUrl || to.fullPath.includes("login") || to.fullPath == "/") {
    //   if (
    //     to.matched.some((record) => record.meta.requireLogin) &&
    //     !store.isAuthenticated == true
    //   ) {
    //     console.log("aqui mal");
    //     next({
    //       name: "Login",
    //       query: { to: to.path },
    //     });
    //   } else next();
    // } else {
    //   alert("no tienes permitido entrar");
    // }
  });

  return Router;
});
