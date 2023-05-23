import { LocalStorage, Notify } from "quasar";
import { api } from "boot/axios";

const createBase64Image = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const mostrarMensajes = (data) => {
  if (data.tipomensaje == 1) {
    Notify.create({
      type: "positive",
      message: data.mensaje,
      timeout: 4000,
    });
  } else if (data.tipomensaje == 2) {
    Notify.create({
      type: "info",
      message: data.mensaje,
      timeout: 4000,
    });
  } else if (data.tipomensaje == 3) {
    Notify.create({
      type: "warning",
      message: data.mensaje,
      timeout: 4000,
    });
  } else if (data.tipomensaje == 4) {
    Notify.create({
      type: "negative",
      message: data.mensaje,
      timeout: 4000,
    });
  }
};

const getSelectedString = (registros) => {
  /* const { t } = useI18n(); */
  return registros === 0
    ? ""
    : `${registros} ` +
        /* t */ `Registro${registros > 1 ? "s" : ""}` +
        " " +
        /* t */ `Selecionado`;
};

let localData = {};
localData = {
  concesion: [],
  plaza: [],
  pista: [],
  sentidoPista: [],
  tipoPista: [],
  dispositivos: {},
  tiquetes: {},
  categorias: [],
  formaspago: [],
  transacciones: {},
  auditoria: {},
  roles: [],
  nivelRol: [],
  genericos: {},
  modulos: {},
  ImagenesReporte: {},
  listaAuditorias: [],
  dataReporte: {},
  denominaciones: [],
  VerEvidencias: false,
  ModoLiquidacion: "BASICO",
  MarcaTransaccion: "",
  ListTiposPago: [],
  ListSentidos: [],
};
const loadLocalData = async () => {
  await api.get("concesion/busqueda").then((response) => {
    localData.concesion = response.data;
  });

  await api.get("/plaza/busqueda").then((response) => {
    localData.plaza = response.data;
  });

  await api.get("/pista/busqueda").then((response) => {
    localData.pista = response.data;
  });

  await api.get("/sentidopista/busqueda").then((response) => {
    localData.sentidoPista = response.data;
    localData.ListSentidos = response.data;
    localData.sentidoPista.push({
      codigosentido: "TODOS",
      descripcion: "Todos",
      idsentido: null,
    });
  });

  await api
    .get("/columna/busqueda?codigotabla=TIPOPISTA&activos=true")
    .then((response) => {
      localData.tipoPista = response.data;
    });

  if (LocalStorage.getItem("datafecha").idplaza == null) {
    await api.get("/categoria/busqueda").then((response) => {
      localData.categorias = response.data;
      localData.categorias.push({
        idcategoria: null,
        nombrecategoria: "Ninguna",
      });
    });
    await api.get("/formapago/busqueda").then((response) => {
      localData.formaspago = response.data;
      localData.formaspago.push({
        idformapago: null,
        nombreformapago: "Ninguna",
      });
    });
  } else {
    await api
      .get(
        `/categoriasplaza/busqueda?activos=true&idplaza=${
          LocalStorage.getItem("datafecha").idplaza
        }`
      )
      .then((response) => {
        localData.categorias = response.data;
        localData.categorias.push({
          idcategoria: null,
          nombrecategoria: "Ninguna",
        });
      });
    await api
      .get(
        `/formaspagoplaza/busqueda?activos=true&idplaza=${
          LocalStorage.getItem("datafecha").idplaza
        }`
      )
      .then((response) => {
        localData.formaspago = response.data;
        localData.formaspago.push({
          idformapago: null,
          nombreformapago: "Ninguna",
        });
      });
  }
  await api.get("/tipopago/busqueda?activos=true").then((response) => {
    localData.ListTiposPago = response.data;
  });

  await api.get("/enumeraciones/auditoria").then((response) => {
    localData.auditoria = response.data;
  });

  await api.get("/rol/busqueda?activos=true").then((response) => {
    localData.roles = response.data;
  });

  await api.get("/enumeraciones/roles").then((response) => {
    localData.nivelRol = response.data;
  });

  await api.get("/enumeraciones/genericos").then((response) => {
    localData.genericos = response.data;
  });

  await api.get("/enumeraciones/modulos").then((response) => {
    localData.modulos = response.data;
  });

  await api.get("/enumeraciones/formapago").then((response) => {
    localData.enumFormaPago = response.data;
  });
  await api.get("/tipovehiculo/busqueda").then((response) => {
    localData.tipoVehiculos = response.data;
  });

  if (LocalStorage.getItem("AfterLogin").nivel == 2) {
    await api
      .get(
        `/tipoauditoria/busqueda?nivel=1&idplaza=${
          LocalStorage.getItem("datafecha").idplaza
        }`
      )
      .then((response) => {
        localData.listaAuditorias = response.data;
      });
  }

  await api.get("/enumeraciones/tiquetes").then((response) => {
    localData.tiquetes.ListTiposTiquetes = response.data.TiposTiquetes;
    localData.tiquetes.ListDetallesTiposTiquetes =
      response.data.DetallesTipoTiquetes;
    localData.tiquetes.ListTiquetesSecciones = response.data.SeccionImpresion;
    localData.tiquetes.ListTiquetesAlineacion = response.data.PrinterAlineacion;
    localData.tiquetes.ListTiquetesFormato = response.data.PrinterFormato;
  });

  await api.get("/enumeraciones/dispositivos").then((response) => {
    localData.dispositivos.codigosDispositivosPista =
      response.data.CodigosDispositivo;
    localData.dispositivos.tiposDispositivosPista =
      response.data.TipoDispositivo;
    localData.dispositivos.TipoDispositivoMantenimiento =
      response.data.TipoDispositivoMantenimiento;
    localData.dispositivos.FormatoImpresion = response.data.FormatoImpresion;
    localData.dispositivos.AlineacionImpresion =
      response.data.AlineacionImpresion;
  });

  await api.get(`/ImagenesProyecto/vista?codigo=GOBIERNO`).then((response) => {
    if (response.status === 200) {
      if (response.data.imagen.indexOf("data") === -1) {
        localData.ImagenesReporte.Gobierno =
          "data:image/png;base64," + response.data.imagen;
      } else {
        localData.ImagenesReporte.Gobierno = response.data.imagen;
      }
    }
  });

  await api.get(`/ImagenesProyecto/vista?codigo=ENTIDAD`).then((response) => {
    if (response.status === 200) {
      if (response.data.imagen.indexOf("data") === -1) {
        localData.ImagenesReporte.Entidad =
          "data:image/png;base64," + response.data.imagen;
      } else {
        localData.ImagenesReporte.Entidad = response.data.imagen;
      }
    }
  });

  await api.get(`/ImagenesProyecto/vista?codigo=PROYECTO`).then((response) => {
    if (response.status === 200) {
      if (response.data.imagen.indexOf("data") === -1) {
        localData.ImagenesReporte.Proyecto =
          "data:image/png;base64," + response.data.imagen;
      } else {
        localData.ImagenesReporte.Proyecto = response.data.imagen;
      }
    }
  });

  await api.get(`/ImagenesProyecto/vista?codigo=SISTEMA`).then((response) => {
    if (response.status === 200) {
      if (response.data.imagen.indexOf("data") === -1) {
        localData.ImagenesReporte.Sistema =
          "data:image/png;base64," + response.data.imagen;
      } else {
        localData.ImagenesReporte.Sistema = response.data.imagen;
      }
    }
  });

  await api.get(`/ImagenesProyecto/vista?codigo=EMPRESA`).then((response) => {
    if (response.status === 200) {
      if (response.data.imagen.indexOf("data") === -1) {
        localData.ImagenesReporte.Empresa =
          "data:image/png;base64," + response.data.imagen;
      } else {
        localData.ImagenesReporte.Empresa = response.data.imagen;
      }
    }
  });
  await api
    .get(`/columna/busqueda?codigotabla=DENOMINACIONES&activos=true`)
    .then((response) => {
      localData.denominaciones = response.data;
    });

  await api.get(`/parametrosconcesion/busqueda`).then((response) => {
    if (response.status === 200) {
      var existeEvidencia = response.data.filter(
        (x) => x.codigo == "MODOMULTIMEDIA"
      );
      if (existeEvidencia.length > 0) {
        if (existeEvidencia[0].valor === "EVIDENCIAS")
          localData.VerEvidencias = true;
      }

      var modoLiquidacion = response.data.filter(
        (x) => x.codigo == "MODOLIQUIDACION"
      );
      if (modoLiquidacion.length > 0) {
        localData.ModoLiquidacion = modoLiquidacion[0].valor;
      }

      var codigoMarcaTransaccion = response.data.filter(
        (x) => x.codigo == "MARCARTRANSACCION"
      );
      if (codigoMarcaTransaccion.length > 0) {
        localData.MarcaTransaccion = codigoMarcaTransaccion[0].valor;
      }
    }
  });
  await api.get("/enumeraciones/transacciones").then((response) => {
    localData.transacciones = response.data;
    localData.transacciones.EstadoNovedadTiquete =
      response.data.EstadoNovedadTiquete.slice(1, -1);
    localData.transacciones.TipoTiquete.push({ id: null, valor: "Ninguna" });
    localData.transacciones.EstadoEvasores.shift();
    localData.transacciones.EstadoEvasores.shift();
    if (response.data.MarcacionTransaccion.length > 0) {
      if (
        response.data.MarcacionTransaccion.filter(
          (x) => x.valor == localData.MarcaTransaccion
        ).length == 0
      )
        localData.MarcaTransaccion = "";
    } else {
      localData.MarcaTransaccion = "";
    }
  });

  var data = {};
  data.Images = localData.ImagenesReporte;
  await api
    .get(`/servidor/informacion/${LocalStorage.getItem("AfterLogin").nivel}`)
    .then((response) => {
      if (response.status === 200) {
        if (
          response.data.nombre === undefined ||
          response.data.nombre === null ||
          response.data.nombre === ""
        )
          data.nombre = "NOMBRE CONCESIÓN";
        data.NombreServidor = response.data.nombre;
        data.IdConcesion = response.data.idconcesion;
        data.IdPlaza = response.data.idplaza;
        data.CodigoPlaza = response.data.codigoplaza;
        data.NombreSistema = response.data.nombresistema;
        data.NombreEmpresa = response.data.nombreempresa;
        data.NombrePlaza = response.data.nombreplaza;
        data.NombreConcesion = response.data.nombreconcesion;
        data.Version = response.data.version;
        data.AnnoActualizacion = response.data.annoactualizacion;
      }
      localData.dataReporte = data;
    });

  LocalStorage.set("localData", localData);
};

const cargarDataNivel = async () => {
  // await api
  //   .get(`/servidor/informacion/${LocalStorage.getItem("AfterLogin").nivel}`)
  //   .then((response) => {
  //     if (response.status === 200) {
  //       if (
  //         response.data.nombre === undefined ||
  //         response.data.nombre === null ||
  //         response.data.nombre === ""
  //       )
  //         data.nombre = "NOMBRE CONCESIÓN";
  //       data.NombreServidor = response.data.nombre;
  //       data.IdConcesion = response.data.idconcesion;
  //       data.IdPlaza = response.data.idplaza;
  //       data.CodigoPlaza = response.data.codigoplaza;
  //       data.NombreSistema = response.data.nombresistema;
  //       data.NombreEmpresa = response.data.nombreempresa;
  //       data.NombrePlaza = response.data.nombreplaza;
  //       data.NombreConcesion = response.data.nombreconcesion;
  //       data.Version = response.data.version;
  //       data.AnnoActualizacion = response.data.annoactualizacion;
  //     }
  //     localData.dataReporte = data;
  //   });
  // // cargarDataNivel();
  // console.log(localData);
  // LocalStorage.set("localData", localData);
};

export {
  createBase64Image,
  mostrarMensajes,
  loadLocalData,
  getSelectedString,
  cargarDataNivel,
};
