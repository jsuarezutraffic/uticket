import axios from "axios";
import { useMainStore } from "src/stores/main";
const store = useMainStore();

//Gets
const enviarNotify = async () => {
  console.log(store.listUsersSelected);
  for (const item of store.listUsersSelected) {
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
  var plantilla = require("../pages/PlantillaCorreo.html").default.toString();
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


const correoAsignacion = async (data,idTiquete) => {
  data.estado = "Asignado";
  data.mensaje1 = `El ticket N° ${idTiquete} fue asignado a usted.`;
  data.mensaje2 = "Por favor verificar y dar solución al ticket.";

  const dominio = "https://uticket.ope.utraffic.co/";
  var accion = `Ticket ${data.estado} Exitosamente!`;
  var mensaje = `${data.mensaje1} <strong>Utraffic SAS.</strong><br> ${data.mensaje2}`;
  var plantilla = require("../pages/PlantillaCorreo.html").default.toString();
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

const correoCliente = async (data,idTiquete,accion) => {
  if (accion == "cerrado") {
    data.estado = "Cerrado";
    data.mensaje1 =
      "La solicitud fue revisada y cerrada por el equipo de soporte de";
    data.mensaje2 = "Por favor verificar y dar por finalizado el ticket";
  } else {
    data.estado = "Actualizado";
    data.mensaje1 = "El ticket fue actualizado";
    data.mensaje2 = `Se ha añadido un comentario al ticket N° ${idTiquete}, por favor revisar`;
  }
  const dominio = "https://uticket.cus.utraffic.co/";
  var accion = `Ticket ${data.estado} Exitosamente!`;
  var mensaje = `${data.mensaje1} <strong>Utraffic SAS.</strong><br> ${data.mensaje2}`;
  var plantilla = require("../pages/PlantillaCorreo.html").default.toString();
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

const correoAviso = async (data,idTiquete) => {
  data.estado = "Pendiente";
    data.mensaje1 = `La solicitud N° ${row.id} asignada a usted está próxima a vencer.`;
    data.mensaje2 = "Por favor verificar y dar solución al ticket.";
    let dominio = store.API_URL_BAK;
    var accion = `Ticket N°${row.id} Pendiente Por Solución!`;
    var mensaje = `${data.mensaje1}<br> ${data.mensaje2}`;
    var plantilla = require("../pages/PlantillaCorreo.html").default.toString();
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
    store.setListUsersSelected()
};

export {
  enviarNotify,
  correoAsignacion,
  correoCliente,
  correoAviso,
};

