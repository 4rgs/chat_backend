//Servidor con express
const express = require("express");
const http = require("http");
const app = express();
const servidor = http.createServer(app);

//Inicializamos socketio
const io = require("socket.io")(servidor, {
  cors: {
    origin: "https://chat.spids.cl"
  }
});

//Funcionalidad de socket.io en el servidor
io.on("connection", (socket) => {
  let nombre;

  socket.on("conectado", (nomb) => {
    nombre = nomb;
    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    socket.broadcast.emit("mensajes", {
      nombre: nombre,
      mensaje: `${nombre} ha entrado en la sala del chat`,
    });
  });

  socket.on("mensaje", (nombre, mensaje) => {
  //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("mensajes", { nombre, mensaje });
  });
  socket.on("respuesta", (nombre, mensaje) => {
    //io.emit la respuesta a todos los clientes conectados al chat
    io.emit("respuestas", { nombre, mensaje });
  });

  socket.on("disconnect", () => {
    io.emit("mensajes", {
      servidor: "Servidor",
      mensaje: `${nombre} ha abandonado la sala`,
    });
  });
});

servidor.listen(5000, () => console.log("Servidor inicializado"));
