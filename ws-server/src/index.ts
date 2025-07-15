import http from "http";
import SocketService from "./services/Socket";

async function init() {
  const httpServer = http.createServer();
  const socketService = new SocketService(httpServer);

  const PORT = process.env.PORT ? process.env.PORT : 3000;

  httpServer.listen(PORT, () => {
    console.log("HTTP server at Port", PORT);
  });

  socketService.initListeners();
}
init();
