const express = require('express'); // Framework de NodeJS que nos permite montar un servidor Web para nuestra aplicación rápidamente.
const app = express();
const path = require('path'); // Para poder trabajar con rutas
const { writeFile } = require("fs"); // Abstracción de la función writeFile que nos permitirá subir la imagen al server.
const bodyParser = require("body-parser"); // Middleware para aumentar el tamaño del json a enviar por POST.
const uniqid = require("uniqid"); // Generar números de id únicos para el nombre de las capturas.

// Configuración del proyecto
app.set('appName','Webcam Stream Project'); // Nombre del proyecto
app.set('port', process.env.PORT || 3000); // Si hay un puerto asignado lo pondrá, si no utilizará el 3000.

// Creamos un servidor http a partir de la librería de Express
const http = require('http').Server(app);

app.use(bodyParser.json({limit: '2mb'})) // Middleware para permitir un mayor flujo de la información enviada.

// Para generar una comunicación entre el emisor y el receptor, vamos a trabajar con socket.io (Es un Websocket que permite comunicación bidireccional (full duplex)).
// Usado en Microsoft Office, Trello.
const io = require('socket.io')(http);

// Especificamos el uso de rutas (también podrían ser dependencias).
app.use(require('./routes/webcamStreaming.routes'));

// Indicamos donde vamos a cargar los archivos html con los trabajaremos.
app.use(express.static(path.join(__dirname, '/public'))); // path.join para concatenar la cadena del directorio, ya sea en Windows/Mac/Linux

// Endpoint para subir la imagen
app.post("/upload-image", (req, res) => {
  // Sustituimos el encabezado de descripción para obtener solo el flujo de la imagen.
  let base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  let destination = `./src/public/images/${ uniqid() }.png`; // Destino de la imagen con nombre único.
  writeFile(destination, base64Data, 'base64', function(err) { // Escritura de la captura en el servidor con manejador de error.
    if(err){ // Si hubo error, nos contestará con un ok: false.
      console.log(err);
      res.status(500).json({
        ok: "false"
      })
    }else{ // Si no hubo error, nos contestará con un ok: true.
      res.status(200).json({
        ok: "true"
      })
    }
  });  
});

// Generamos un evento para abrir una conexión multicanal del socket
// connection nombre reservado
io.on('connection', (socket) => {
  // Habilitamos evento de stream.
  socket.on('stream', (image) => {
    //Enviamos la imagen con el evento stream a todos los sockets conectados.
    socket.broadcast.emit('stream',image);    
  });
});

// Cuando está habilitado el servidor imprimirá un mensaje en consola.
http.listen(app.get('port'), () => {
  console.log('Servidor en el puerto 3000');
});
