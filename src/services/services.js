import { api } from "boot/axios";
import axios from "axios";

//Gets
const getTiquetes = (filtro) => {
  return api.get(`tiquete?${filtro}select=*`);
};
const getCliente = (filtro) => {
  return api.get(`cliente?${filtro}select=*`);
};
const getConcesion = (filtro) => {
  return api.get(`concesion?${filtro}select=*`);
};
const getPeaje = (filtro) => {
  return api.get(`peaje?${filtro}select=*`);
};
const getTipo = (filtro) => {
  return api.get(`tipo?${filtro}select=*`);
};
const getSubtipo = (filtro) => {
  return api.get(`subtipo?${filtro}select=*`);
};
const getPrioridad = (filtro) => {
  return api.get(`prioridad?${filtro}select=*`);
};
const getEstado = (filtro) => {
  return api.get(`estado?${filtro}select=*`);
};
const getSolicitud = (filtro) => {
  return api.get(`solicitud?${filtro}select=*`);
};
const getProceso = (filtro) => {
  return api.get(`proceso?${filtro}select=*`);
};
const getUsuarios = (filtro) => {
  return api.get(`usuarios?${filtro}select=*`);
};
const getEquipo = (filtro) => {
  return api.get(`equipo?${filtro}select=*`);
};
const getMetodoConsulta = (filtro) => {
  return api.get(`metodoconsulta?${filtro}select=*`);
};
const getDetalleTiquete = (filtro) => {
  return api.get(`detalletiquete?${filtro}select=*`);
};
/// datos generales
const getDatosGenerales = async (idusuario) => {
  let data = {
    cliente: [],
    clientes: [],
    concesion: [],
    peajes: [],
    Tipos: [],
    Subtipos: [],
    Equipos: [],
    Prioridades: [],
    Estados: [],
    Solicitudes: [],
    Procesos: [],
    Usuarios: [],
  };
  await getCliente(`usuario=eq.${idusuario}&`).then((response) => {
    data.cliente = response.data;
  });

  await getCliente(``).then((response) => {
    data.clientes = response.data;
  });
  await getConcesion(`id=eq.${data.cliente[0].concesion}&`).then((response) => {
    data.concesion = response.data;
  });
  await getPeaje(`concesion=eq.${data.concesion[0].id}&`).then((response) => {
    data.peajes = response.data;
  });

  await getTipo("").then((response) => {
    data.Tipos = response.data;
  });

  await getSubtipo("").then((response) => {
    data.Subtipos = response.data;
  });
  await getEquipo("").then((response) => {
    data.Equipos = response.data;
  });

  await getPrioridad("").then((response) => {
    data.Prioridades = response.data;
    data.Prioridades.sort(function (b, a) {
      return b.orden - a.orden;
    });
  });

  await getEstado("").then((response) => {
    data.Estados = response.data;
  });

  await getSolicitud("").then((response) => {
    data.Solicitudes = response.data;
  });

  await getProceso("").then((response) => {
    data.Procesos = response.data;
  });

  await getUsuarios("").then((response) => {
    data.Usuarios = response.data;
  });

  return data;
};

//Post
const postTiquetes = (postData) => {
  return api.post(`tiquete`, postData);
};

const postDetallesTiquetes = (postData) => {
  return api.post(`detalletiquete`, postData);
};

const postCliente = (postData) => {
  return api.post(`cliente`, postData);
};
//Put
const putTiquetes = (filtro, postData) => {
  return api.put(`tiquete?${filtro}`, postData);
};

const putCliente = (filtro, postData) => {
  return api.put(`cliente?${filtro}`, postData);
};

const postCorreo = async (data2) => {
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
export {
  getTiquetes,
  getEstado,
  getSolicitud,
  getProceso,
  getCliente,
  getUsuarios,
  getConcesion,
  getPeaje,
  getPrioridad,
  getSubtipo,
  getTipo,
  getEquipo,
  getDatosGenerales,
  getDetalleTiquete,
  getMetodoConsulta,
  postDetallesTiquetes,
  postTiquetes,
  postCorreo,
  postCliente,
  putTiquetes,
  putCliente,
};
