<template>
  <div class="q-pa-md" id="divPadre">
    <div class="card-perfil" v-show="verPerfil">
      <q-form autofocus @submit.prevent="actualizarPerfil()"
        ><q-card style="max-width: 1000px; width: 600px">
          <q-card-section class="row">
            <div
              class="col-11"
              style="font-size: 18px; font-weight: bold; align-self: center"
            >
              Perfil
            </div>
            <div
              class="col-1"
              style="font-size: 18px; font-weight: bold; align-self: center"
            >
              <q-btn
                to="/"
                flat
                icon="arrow_back"
                style="display: flex; margin-left: auto"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="row" style="background: #ffffff">
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-input
                      v-model="users.nombre"
                      :label="'Nombres'"
                      class="q-pa-md"
                      outlined
                    />
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-input
                      v-model="users.telefono"
                      :label="'Telefono'"
                      mask="(###) ### - ####"
                      unmasked-value
                      outlined
                      class="q-pa-md"
                    />
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-select
                      readonly
                      v-model="users.nivel"
                      :options="Procesos"
                      option-label="descripcion"
                      option-value="id"
                      label="Nivel Actual"
                      class="q-pa-md"
                      emit-value
                      outlined
                      map-options
                    ></q-select>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-input
                      v-model="users.correo"
                      :label="'Correo'"
                      outlined
                      type="email"
                      class="q-pa-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal q-pr-md">
            <q-btn
              flat
              color="primary"
              :label="'Actializar Perfil'"
              type="submit"
              text-color="dark"
              no-caps
            />
            <q-btn
              flat
              color="primary"
              :label="'Cambiar Contraseña'"
              @click="verPerfil = !verPerfil"
              text-color="dark"
              no-caps
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
    <div class="card-perfil" v-show="!verPerfil">
      <q-card style="max-width: 1000px; width: 600px">
        <q-form autofocus @submit.prevent="actualizarPassword()">
          <q-card-section>
            <div style="font-size: 18px; font-weight: bold; align-self: center">
              Cambiar Contraseña
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="row" style="background: #ffffff">
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-input
                      v-model="newPassword"
                      :label="'Nueva Contraña'"
                      type="password"
                      outlined
                      class="q-pa-md"
                    />
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <q-input
                      :rules="passwordRule"
                      v-model="newPassword2"
                      :label="'Repetir Contraseña'"
                      type="password"
                      outlined
                      class="q-pa-md"
                    />
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <FileInput
                      @datos-exportado-cambiado="actualizarValorDatosExportado"
                    ></FileInput>
                    <InputTextJump
                      @text-con-salto-linea="actualizarTextExport"
                    ></InputTextJump>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal q-pr-md">
            <q-btn
              flat
              color="primary"
              :label="'Aceptar'"
              type="submit"
              text-color="dark"
              no-caps
            />
            <q-btn
              flat
              :label="'Volver'"
              @click="verPerfil = !verPerfil"
              text-color="dark"
              no-caps
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </div>
  <q-inner-loading
    :showing="visible"
    label="Cargando..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  watch,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useMainStore } from "../stores/main";
import { LocalStorage } from "quasar";
const idusuario = LocalStorage.getItem("IdUsuario");

const users = ref([]);
const Procesos = ref([]);
const visible = ref(false);
const passwordRule = [
  (value) => value == newPassword.value || "Las contraseñas deben coincidir",
];
const newPassword = ref("");
const newPassword2 = ref("");
const { emit } = getCurrentInstance();
let $q = useQuasar();
const store = useMainStore();
const verPerfil = ref(true);

const getUsers = async () => {
  await api.get(`usuarios?id=eq.${idusuario}&select=*`).then((response) => {
    users.value = response.data[0];
  });
  await api.get("proceso?select=*").then((response) => {
    Procesos.value = response.data;
  });
};

async function actualizarPerfil() {
  visible.value = true;
  await api.put(`usuarios?id=eq.${idusuario}`, users.value).then((response) => {
    $q.notify({
      type: "positive",
      message: "Perfil Actualizado Correctamente",
    });
    visible.value = false;
  });
}

const actualizarPassword = async () => {
  if (newPassword.value == newPassword2.value) {
    visible.value = true;
    var user = {
      email: users.value.correo,
      password: newPassword2.value,
      data: {
        key: "value",
      },
    };
    await api
      .put(`${store.supabase_Url}/auth/v1/user`, user)
      .then((response) => {
        $q.notify({
          type: "positive",
          message: "Contraseña Actualizada Correctamente",
        });
        visible.value = false;
      })
      .catch((error) => {
        visible.value = false;
        if (error.response.data.code == 422) {
          $q.notify({
            type: "negative",
            message: "La contraseña debe tener mas de 5 caracteres",
          });
        }
      });
  } else {
    $q.notify({
      type: "negative",
      message: "Las contraseñas deben coincidir",
    });
  }
};

onMounted(async () => {
  // api.defaults.headers.common["Accept-Language"] = locale.value;
  // $q = useQuasar();
  await getUsers();
  // loadData();
});
</script>

<style scoped>
.card-perfil {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  /* z-index: -1; */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #31d3ae;
}

.col {
  padding: 15px;
}
</style>
