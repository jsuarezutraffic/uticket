const routes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    name: "Operation",
    path: "/",
    meta: { requireLogin: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/Operation/index",
        meta: { requireLogin: true },
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "/Operation/dashboard",
        meta: { requireLogin: true },
        component: () => import("pages/DashboardPage.vue"),
      },
    ],
  },
  {
    name: "BackOffice",
    path: "/",
    meta: { requireLogin: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/BackOffice/index",
        meta: { requireLogin: true },
        component: () => import("pages/IndexSupabase.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
