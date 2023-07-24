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

export {
  createBase64Image,
  mostrarMensajes,
  getSelectedString,
};
