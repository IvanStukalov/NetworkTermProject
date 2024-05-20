const express = require("express");
const axios = require("axios");
const http = require("http");

const app = express(); // создание экземпляра приложения express
const server = http.createServer(app); // создание HTTP-сервера
app.use(express.json());

const port = 8002; // присвоение порта
const hostname = "localhost";

// заглушка для метода send
app.post("/send", async (req, res) => {
  const message = req.body;

  const response = await sendMsgToWebSocketServer(message);
  if (response.status !== 200) {
    res.sendStatus(403);
  }
  res.sendStatus(200);
});

// посылаем сообщение на ws-server
const sendMsgToWebSocketServer = async (message) => {
  const response = await axios.post(`http://${hostname}:8001/receive`, message);
  return response;
};

// запуск сервера приложения
server.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`);
});
