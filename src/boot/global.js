import { boot } from "quasar/wrappers";
import {
  createBase64Image,
  mostrarMensajes,
  getSelectedString,
  loadLocalData,
  cargarDataNivel,
} from "../utils/global.js";

export default ({ app }) => {
  app.config.globalProperties.$createBase64Image = createBase64Image;
  app.config.globalProperties.$mostrarMensajes = mostrarMensajes;
  app.config.globalProperties.$getSelectedString = getSelectedString;
  app.config.globalProperties.$loadLocalData = loadLocalData;
  app.config.globalProperties.$cargarDataNivel = cargarDataNivel;
};

export {
  createBase64Image,
  mostrarMensajes,
  getSelectedString,
  loadLocalData,
  cargarDataNivel,
};
