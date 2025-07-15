// services/Socket.ts
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidV4 } from "uuid";
import http from "http";
import Redis from "ioredis";

const pub = new Redis({
  host: "localhost",
  port: 6379,
  password: "your-password",
});
const sub = new Redis({
  host: "localhost",
  port: 6379,
  password: "your-password",
});

const clients = new Map<string, WebSocket>();

class SocketService {
  private _io: WebSocketServer;

  constructor(server: http.Server) {
    this._io = new WebSocketServer({ server });

    // ✅ Subscribe immediately
    sub.subscribe("MESSAGES", (err, count) => {
      if (err) {
        console.error("Failed to subscribe:", err);
      } else {
        console.log("Subscribed to MESSAGES channel");
      }
    });

    // ✅ Listen and broadcast to all clients
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("[Redis -> WS] Broadcasting:", message);
        clients.forEach((client, id) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
          } else {
            console.warn(`Client ${id} not open`);
          }
        });
      }
    });
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this._io;

    io.on("connection", (client: WebSocket) => {
      const clientId = uuidV4();
      clients.set(clientId, client);

      client.on("message", async (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed?.message) {
            await pub.publish("MESSAGES", parsed.message);
          }
        } catch (err) {
          console.error("Invalid JSON format:", data.toString());
        }
      });

      client.on("close", () => {
        clients.delete(clientId);
      });
    });
  }
}

export default SocketService;
