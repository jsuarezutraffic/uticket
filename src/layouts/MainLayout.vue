<template>
  <q-layout view="lHh lpR lFf">
    <!-- Header -->
    <q-header
      class="bg-primary text-white flex justify-items header-style"
      height-hint="98"
      elevated
    >
      <!-- Header Left-side -->
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          v-if="configJson.nivel == 1"
        />

        <!-- Logo Header -->
        <q-toolbar-title class="q-py-xs vertical-center">
          <img
            v-if="configJson.nivel == 1"
            fit="scale-down"
            src="../assets//img/Logo_Backoffice2.png"
            class="cursor-pointer img-logo"
            @click="inicio()"
          />
          <img
            v-if="configJson.nivel == 2"
            fit="scale-down"
            src="../assets/img/Logo_Operador2.png"
            class="cursor-pointer img-logo"
            @click="inicio()"
          />
        </q-toolbar-title>
        <q-space />

        <!-- Header Right-side -->
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn dense round flat icon="notifications" class="q-mx-sm">
            <q-badge
              color="red"
              floating
              v-if="store.listNotificaciones.length > 0"
            >
              {{ store.listNotificaciones.length }}
            </q-badge>
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 15em">
                <q-item
                  v-for="(item, index) in store.listNotificaciones"
                  :key="index"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <q-icon :name="item.icon" color="primary" />
                      <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    {{ item.mensaje }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column items-center">
                    <a href="#/perfil">
                      <q-avatar size="72px">
                        <q-img
                          src="https://cdn.quasar.dev/img/boy-avatar.png"
                        />
                      </q-avatar>
                    </a>
                    <div class="text-weight-bold">{{ user.nombre }}</div>
                    <div>{{ user.correo }}</div>

                    <q-btn
                      class="q-ma-xs"
                      color="primary"
                      label="Cerrar Sesión"
                      push
                      size="sm"
                      v-close-popup
                      @click="cerrarSesion()"
                    />
                  </div>
                </div>
              </q-menu>
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <!-- drawer content -->
      <div class="q-pa-sm">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <MenuBar class="flex-center" />
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import MenuBar from "src/components/MenuBar.vue";
import { useMainStore } from "stores/main";
import { useRouter, useRoute } from "vue-router";
import { LocalStorage, useQuasar } from "quasar";
import { getUsuarios } from "../services/services.js";
const configJson = require("/public/config.json");
const idusuario = LocalStorage.getItem("IdUsuario");
const router = useRouter();
const user = ref([]);

const store = useMainStore();

const leftDrawerOpen = ref(false);
defineComponent({
  name: "MainLayout",
  components: {
    MenuBar,
  },
});
function inicio() {
  const toPath = "/";
  router.push(toPath);
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const getUsers = async () => {
  await getUsuarios(`id=eq.${idusuario}&`).then((response) => {
    user.value = response.data[0];
  });
};
const cerrarSesion = () => {
  store.borrar();
  router.push("/login");
};

onMounted(async () => {
  await getUsers();
});
</script>

<style lang="scss" scoped>
.header-content {
  display: flex;
  align-items: center;
}

.background-menu {
  background-color: #1d1d1d77;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
}

.background-menu-active {
  background-color: #ffffff00;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  display: none;
}

.header-style {
  border-bottom: 2px solid #26a69965;
}
</style>
