q-list// src/components/Chat.vue
<template>
  <q-editor
    ref="messageInput"
    v-model="text"
    :definitions="{
      bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' },
    }"
    @mousemove="updateListPosition"
    @update:model-value="handleInput"
  />

  <!--  -->
  <div
    v-show="showUserList"
    class="user-list-container"
    :class="{ 'show-list': showUserList }"
    :style="{ top: listPosition.top + 'px', left: listPosition.left + 'px' }"
  >
    <q-list dense bordered padding class="rounded-borders">
      <q-item
        v-for="(user, index) in matchedUsers"
        :key="index"
        clickable
        v-ripple
        @click="selectUser(user)"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          {{ user.nombre }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <q-btn class="q-mx-md" label="Si" color="primary" @click="enviar()" />
</template>

<script setup>
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
} from "vue";
import FileInput from "src/components/FileImage.vue";
import { useMainStore } from "src/stores/main";
import axios from "axios";

const store = useMainStore();
const messageInput = ref(null);
const showUserList = ref(false);
const matchedUsers = ref([]);
const listUsersSelected = ref([]);
const users = store.generalData.usuarios;
let listPosition = { top: 0, left: 0 };
const text = ref("");

const handleInput = () => {
  listUsersSelected.value = listUsersSelected.value.filter((item) =>
    text.value.includes(item.nombre)
  );
  if (text.value.includes("@")) {
    let searchTerm = text.value.split("@")[1];
    matchedUsers.value = users.filter((user) =>
      user.nombre.includes(searchTerm)
    );
    showUserList.value = matchedUsers.value.length > 0;
  } else {
    showUserList.value = false;
  }
};

const selectUser = (user) => {
  const selectedUser = `<a href="https://">${user.nombre} </a>`;
  const currentText = text.value;
  let newText = currentText.replace(/@[a-zA-Z0-9]+$/, `${selectedUser} `);
  if (newText.includes("@")) {
    newText = currentText.replace("@", `${selectedUser} `);
  }
  text.value = newText;
  showUserList.value = false;

  listUsersSelected.value.push(user);
  listUsersSelected.value = listUsersSelected.value.filter((item) =>
    newText.includes(item.nombre)
  );
};
const updateListPosition = (event) => {
  if (showUserList.value && messageInput.value) {
    const editor = messageInput.value.$el; // Obtén el elemento DOM del ref
    const rect = editor.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    listPosition = { top: mouseY, left: mouseX };
  }
};

const enviar = async () => {
  console.log(listUsersSelected.value);
  console.log(store.generalData.usuarios);
  for (const item of listUsersSelected.value) {
    await notificarTicket(item);
  }
};

const notificarTicket = async (cliente) => {
  const data = {};
  data.email = cliente.correo;
  data.cliente = cliente.nombre;
  data.estado = "Notificacion";
  data.mensaje1 = "Usted Fue mencionado en el Tiket numero #123";
  data.mensaje2 = "Por favor verificar el ticket";

  const dominio = "https://uticket.ope.utraffic.co/";
  var accion = `${data.estado} Ticket!`;
  var mensaje = `${data.mensaje1} <strong>Utraffic SAS.</strong><br> ${data.mensaje2}`;
  var plantilla = require("./PlantillaCorreo.html").default.toString();
  plantilla = plantilla.replace("${accion}", accion);
  plantilla = plantilla.replace("${mensaje}", mensaje);
  plantilla = plantilla.replace("${dominio}", dominio);

  //soporte@utraffic.co
  //#Utraffic2022**
  const data2 = {
    sender: {
      name: "Soporte Utraffic",
      email: "soporte@utraffic.co",
    },
    to: [
      {
        email: data.email,
        name: data.nombres,
      },
    ],
    subject: `Ticket ${data.estado}`,
    htmlContent: plantilla,
  };
  enviarCorreo(data2);
};
const enviarCorreo = async (data2) => {
  const apiKey =
    "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";

  await axios
    .post("https://api.brevo.com/v3/smtp/email", data2, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    })
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};
</script>
<style lang="scss">
.user-list-container {
  position: absolute;
  background-color: white;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  max-height: 200px; /* Establece la altura máxima que desees para la lista */
  overflow-y: auto; /* Agrega una barra de desplazamiento vertical si la lista es larga */
  z-index: 999; /* Ajusta el valor de z-index según sea necesario para que esté por encima de otros elementos */
}
</style>
