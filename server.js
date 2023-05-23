const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
app.use(bodyParser.json());
// Configuración de SendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
app.use(cors());
// Ruta para enviar un correo
app.post("/enviar-correo", (req, res) => {
  const msg = {
    to: req.body.email,
    from: "ldiaz@utraffic.co",
    templateId: "d-6bc31a8f2e6847129f044a25b6bc15f0",
    dynamicTemplateData: {
      // Puedes proporcionar los datos dinámicos utilizados en la plantilla aquí
      estado: req.body.estado,
      mensaje1: req.body.mensaje1,
      mensaje2: req.body.mensaje2,
      Subject: "Ticket " + req.body.estado,
      // Otros campos dinámicos...
    },
  };

  sgMail
    .send(msg)
    .then(() => res.send("Correo enviado con éxito"))
    .catch((error) => {
      res.status(500).send("Error al enviar el correo");
    });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js `);
});
