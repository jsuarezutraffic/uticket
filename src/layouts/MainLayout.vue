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
        <!-- boton de menú -->
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-space />

        <!-- Logo Header -->

        <q-toolbar-title class="text-center flex flex-center q-mt-xs q-mb-xs">
          <img
            src="../assets/U-Traffic-versión-horizontal-removebg-preview-removebg-preview.png"
            class="header-logo cursor-pointer"
            @click="inicio()"
          />
        </q-toolbar-title>
        <q-space />

        <!-- Header Right-side -->
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="message"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Messages</q-tooltip>
          </q-btn>

          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->

          <q-btn round flat>
            <q-avatar size="26px">
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
                    <div class="text-weight-bold">{{ user.nombres }}</div>
                    <div>{{ user.correo }}</div>

                    <q-btn
                      class="q-ma-xs"
                      color="primary"
                      label="Cerrar Sesión"
                      push
                      size="sm"
                      v-close-popup
                      @click="logout"
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

    <q-item class="background-menu-active" active> </q-item>
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
import { LocalStorage } from "quasar";
import { api } from "boot/axios";

const store = useMainStore();
const router = useRouter();
const leftDrawerOpen = ref(false);
const idusuario = LocalStorage.getItem("IdUsuario");
const user = ref([]);
defineComponent({
  name: "MainLayout",
  components: {
    MenuBar,
  },
});
const getUsers = async () => {
  await api.get(`cliente?usuario=eq.${idusuario}&select=*`).then((response) => {
    user.value = response.data[0];
  });
};
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function logout() {
  store.borrar();
  const toPath = "/Login";
  router.push(toPath);
}
function inicio() {
  // if (configstore.config.nivel == 2) {
  const toPath = "/";
  router.push(toPath);
  // } else if (configstore.config.nivel == 2) {
  //   const toPath = "/";
  //   router.push(toPath);
  // }
}
onMounted(async () => {
  await getUsers();
});
</script>

<style lang="scss" scoped>
.header-logo {
  width: 120px;
}

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
