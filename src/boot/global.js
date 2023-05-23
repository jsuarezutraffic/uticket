import { boot } from "quasar/wrappers";
import { createBase64Image } from "../utils/global";

export default ({ app }) => {
  app.config.globalProperties.$createBase64Image = createBase64Image;
};

export { createBase64Image };
