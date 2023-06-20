const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path");
const configJson = require(path.join(__dirname, "dist/spa/config.json"));
const portMail = configJson.portMail


app.use(bodyParser.json())
// Configuración de SendGrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(
  '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'
)
app.use(cors())
// Ruta para enviar un correo
app.post('/enviar-correo', (req, res) => {
  const msg = {
    to: req.body.email,
    from: 'soporte@utraffic.co',
    templateId: 'd-6bc31a8f2e6847129f044a25b6bc15f0',
    dynamicTemplateData: {
      // Puedes proporcionar los datos dinámicos utilizados en la plantilla aquí
      estado: req.body.estado,
      mensaje1: req.body.mensaje1,
      mensaje2: req.body.mensaje2,
      Subject: 'Ticket ' + req.body.estado
      // Otros campos dinámicos...
    }
  }

  sgMail
    .send(msg)
    .then(() => res.send('Correo enviado con éxito'))
    .catch((error) => {
      res.status(500).send('Error al enviar el correo')
    })
})

// Iniciar el servidor
app.listen(portMail, () => {
  console.log(`Servidor Node.js corriendo en el puert0 ${portMail}`)
})


///------------------------------SERVIDOR PARA PRODUCCION-----------------
app.use(express.static(path.join(__dirname, "dist/spa")));

// Ruta para todas las solicitudes GET
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/spa/index.html"));
});

// Puerto en el que se ejecutará el servidor
const port = configJson.port;
const host = configJson.host;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://${host}:${port}`);
});


//--------------PACKET JSON NECESARIOS--------------
// {
//   "dependencies": {
//     "express": "^4.18.2",
//     "@sendgrid/mail": "^7.7.0",
//     "cors": "^2.8.5"
//   }
// }
