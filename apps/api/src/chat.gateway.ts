import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";

const ROOM_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_ROOM_SIZE = 12;
const MAX_CIPHERTEXT_LENGTH = 4096;
const MAX_MESSAGES_PER_WINDOW = 20;
const MESSAGE_WINDOW_MS = 60_000;

@WebSocketGateway({
  namespace: "/peer",
  transports: ["websocket"],
  maxHttpBufferSize: 8_192,
  cors: {
    origin: (origin, callback) => {
      callback(null, origin === (process.env.WEB_ORIGIN ?? "http://localhost:3000"));
    },
    methods: ["GET"],
    credentials: false,
  },
  allowRequest: (request, callback) => {
    callback(null, request.headers.origin === (process.env.WEB_ORIGIN ?? "http://localhost:3000"));
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Namespace;

  private readonly messageTimes = new Map<string, number[]>();

  handleDisconnect(client: Socket): void {
    for (const roomId of client.rooms) {
      if (ROOM_ID_PATTERN.test(roomId)) {
        this.broadcastPresence(roomId);
      }
    }

    this.messageTimes.delete(client.id);
  }

  @SubscribeMessage("room:join")
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): { event: string; data: { message: string } | { count: number } } {
    const roomId =
      typeof body === "object" && body !== null && "roomId" in body
        ? (body as { roomId?: unknown }).roomId
        : undefined;

    if (typeof roomId !== "string" || !ROOM_ID_PATTERN.test(roomId)) {
      return { event: "room:error", data: { message: "That room link is not valid." } };
    }

    const room = this.server.adapter.rooms.get(roomId);
    if (!client.rooms.has(roomId) && room && room.size >= MAX_ROOM_SIZE) {
      return { event: "room:error", data: { message: "This room has reached its participant limit." } };
    }

    void client.join(roomId);
    const count = this.server.adapter.rooms.get(roomId)?.size ?? 0;
    this.server.to(roomId).emit("room:presence", { count });
    return { event: "room:joined", data: { count } };
  }

  @SubscribeMessage("room:message")
  relayMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): { event: string; data: { message?: string } } {
    if (typeof body !== "object" || body === null || !("roomId" in body) || !("payload" in body)) {
      return { event: "room:error", data: { message: "That message could not be sent." } };
    }

    const { roomId, payload } = body as {
      roomId?: unknown;
      payload?: unknown;
    };

    if (
      typeof roomId !== "string" ||
      !ROOM_ID_PATTERN.test(roomId) ||
      !client.rooms.has(roomId) ||
      typeof payload !== "object" ||
      payload === null ||
      !("iv" in payload) ||
      !("ciphertext" in payload)
    ) {
      return { event: "room:error", data: { message: "That message could not be sent." } };
    }

    const encrypted = payload as { iv?: unknown; ciphertext?: unknown };
    if (
      typeof encrypted.iv !== "string" ||
      !/^[A-Za-z0-9_-]{16}$/.test(encrypted.iv) ||
      typeof encrypted.ciphertext !== "string" ||
      !/^[A-Za-z0-9_-]+$/.test(encrypted.ciphertext) ||
      encrypted.ciphertext.length > MAX_CIPHERTEXT_LENGTH
    ) {
      return { event: "room:error", data: { message: "That message could not be sent." } };
    }

    const now = Date.now();
    const recent = (this.messageTimes.get(client.id) ?? []).filter(
      (timestamp) => now - timestamp < MESSAGE_WINDOW_MS,
    );
    if (recent.length >= MAX_MESSAGES_PER_WINDOW) {
      return { event: "room:error", data: { message: "Please pause before sending another message." } };
    }

    recent.push(now);
    this.messageTimes.set(client.id, recent);
    this.server.to(roomId).emit("room:message", { iv: encrypted.iv, ciphertext: encrypted.ciphertext });
    return { event: "room:sent", data: {} };
  }

  private broadcastPresence(roomId: string): void {
    const count = this.server.adapter.rooms.get(roomId)?.size ?? 0;
    this.server.to(roomId).emit("room:presence", { count });
  }
}
