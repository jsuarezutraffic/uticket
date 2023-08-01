const routes = [
  {
    name: "Login",
    path: "/Login",
    component: () => import("pages/LoginPage.vue"),
    // children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/register",
    component: () => import("pages/RegisterPage.vue"),
  },
  {
    path: "/registerSuccess",
    component: () => import("pages/RegisterSuccessful.vue"),
  },
  {
    path: "/",
    meta: { requireLogin: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        meta: { requireLogin: true },
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "/tiquetes",
        meta: { requireLogin: true },
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/clientes",
        meta: { requireLogin: true },
        component: () => import("pages/Clientes.vue"),
      },
      {
        path: "/perfil",
        meta: { requireLogin: true },
        component: () => import("pages/Perfil.vue"),
      },

      {
        path: "/prueba",
        meta: { requireLogin: true },
        component: () => import("pages/Prueba.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/access_token=:token",
    component: () => import("src/pages/RegisterSuccessful.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
