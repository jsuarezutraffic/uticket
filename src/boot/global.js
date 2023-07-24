import { boot } from "quasar/wrappers";
import {
  createBase64Image,
  mostrarMensajes,
  getSelectedString,
} from "../utils/global.js";

export default ({ app }) => {
  app.config.globalProperties.$createBase64Image = createBase64Image;
  app.config.globalProperties.$mostrarMensajes = mostrarMensajes;
  app.config.globalProperties.$getSelectedString = getSelectedString;
};

export {
  createBase64Image,
  mostrarMensajes,
  getSelectedString,
};
