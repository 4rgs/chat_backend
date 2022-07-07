//Servidor con express
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat.spids.cl"
  }
});

app.get('/',(req,res) => {
  res.send('habilitado')
})

//Funcionalidad de socket.io en el server
io.on("connection", (socket) => {
  let nombre;

  socket.on("connected", (name) => {
    nombre = name;
    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    socket.broadcast.emit("messages", {
      nombre: nombre,
      mensaje: `${nombre} ha entrado en la sala del chat`,
    });
  });

  socket.on("message", (nombre, mensaje) => {
  //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("messages", { nombre, mensaje });
  });
  socket.on("response", (nombre, mensaje) => {
    //io.emit la respuesta a todos los clientes conectados al chat
    io.emit("response", { nombre, mensaje });
  });

  socket.on("disconnect", () => {
    io.emit("messages", {
      server: "Servidor",
      message: `${nombre} ha abandonado la sala`,
    });
  });
});

server.listen(port, () => console.log("Servidor inicializado"));
