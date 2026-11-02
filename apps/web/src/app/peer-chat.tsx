"use client";

import {
  ArrowUpRight,
  Check,
  Clipboard,
  LockKeyhole,
  LogOut,
  MessageCircleHeart,
  ShieldAlert,
  Trash2,
  UsersRound,
} from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { FormEvent, useEffect, useRef, useState } from "react";

type RoomInvite = { roomId: string; key: string };
type ChatMessage = { id: string; alias: string; text: string; time: string };
type EncryptedPacket = { iv: string; ciphertext: string };

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const bytes = new Uint8Array(decoded.length);
  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }
  return bytes;
}

function readInvite(value: string): RoomInvite | null {
  try {
    const url = new URL(value);
    const hash = new URLSearchParams(url.hash.slice(1));
    const roomId = hash.get("room");
    const key = hash.get("key");
    if (!roomId || !key || !crypto.randomUUID) return null;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roomId)) {
      return null;
    }
    if (base64UrlToBytes(key).length !== 32) return null;
    return { roomId, key };
  } catch {
    return null;
  }
}

async function importRoomKey(key: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", base64UrlToBytes(key), "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

function randomAlias(): string {
  const words = ["quiet", "kind", "soft", "bright", "brave", "open", "gentle", "steady"];
  const choice = crypto.getRandomValues(new Uint32Array(1))[0] % words.length;
  const suffix = 10 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90);
  return `${words[choice]}-${suffix}`;
}

export default function PeerChat() {
  const [alias, setAlias] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [invite, setInvite] = useState<RoomInvite | null>(null);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [participantCount, setParticipantCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const senderIdRef = useRef("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAlias(randomAlias());
    const parsedInvite = readInvite(window.location.href);
    if (parsedInvite) {
      setInvite(parsedInvite);
      setInviteLink(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!invite || !ageConfirmed) return;

    let active = true;
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/peer`, {
      transports: ["websocket"],
      reconnection: false,
      timeout: 5000,
    });
    socketRef.current = socket;
    senderIdRef.current = crypto.randomUUID();
    setError("");

    socket.on("connect", () => {
      socket.emit("room:join", { roomId: invite.roomId });
    });
    socket.on("connect_error", () => {
      if (active) {
        setConnected(false);
        setError("Could not connect to the private chat. Please try again later.");
      }
    });
    socket.on("room:joined", (data: { count: number }) => {
      if (active) {
        setConnected(true);
        setParticipantCount(data.count);
      }
    });
    socket.on("room:presence", (data: { count: number }) => {
      if (active) setParticipantCount(data.count);
    });
    socket.on("room:error", (data: { message: string }) => {
      if (active) setError(data.message);
    });
    socket.on("room:message", async (packet: EncryptedPacket) => {
      if (!active) return;
      try {
        const key = await importRoomKey(invite.key);
        const plaintext = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: base64UrlToBytes(packet.iv) },
          key,
          base64UrlToBytes(packet.ciphertext),
        );
        const decoded: unknown = JSON.parse(new TextDecoder().decode(plaintext));
        if (typeof decoded !== "object" || decoded === null) return;

        const message = decoded as Partial<ChatMessage> & { senderId?: unknown };
        const parsedTime =
          typeof message.time === "string" ? Date.parse(message.time) : Number.NaN;
        if (
          message.senderId === senderIdRef.current ||
          typeof message.senderId !== "string" ||
          typeof message.id !== "string" ||
          message.id.length > 64 ||
          typeof message.alias !== "string" ||
          message.alias.length > 40 ||
          typeof message.text !== "string" ||
          message.text.length > 1000 ||
          !Number.isFinite(parsedTime)
        ) {
          return;
        }

        const validMessage: ChatMessage = {
          id: message.id,
          alias: message.alias,
          text: message.text,
          time: new Date(parsedTime).toISOString(),
        };
        setMessages((current) => [...current, validMessage].slice(-100));
      } catch {
        if (active) setError("A message could not be decrypted with this room link.");
      }
    });

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [ageConfirmed, invite]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function setInviteInAddressBar(nextInvite: RoomInvite): string {
    const hash = new URLSearchParams({ room: nextInvite.roomId, key: nextInvite.key });
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${hash}`;
    window.history.replaceState(null, "", url);
    return url;
  }

  async function createRoom() {
    if (!window.isSecureContext || !crypto.subtle) {
      setError("Encrypted chat needs a secure connection (HTTPS).");
      return;
    }
    const keyBytes = crypto.getRandomValues(new Uint8Array(32));
    const nextInvite = { roomId: crypto.randomUUID(), key: bytesToBase64Url(keyBytes) };
    const link = setInviteInAddressBar(nextInvite);
    setMessages([]);
    setInviteLink(link);
    setInvite(nextInvite);
  }

  function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextInvite = readInvite(inviteInput.trim());
    if (!nextInvite) {
      setError("Paste a complete She Deserves room invitation link.");
      return;
    }
    if (!window.isSecureContext || !crypto.subtle) {
      setError("Encrypted chat needs a secure connection (HTTPS).");
      return;
    }
    setError("");
    setMessages([]);
    setInviteLink(inviteInput.trim());
    setInvite(nextInvite);
    window.history.replaceState(null, "", `${window.location.origin}${window.location.pathname}${window.location.search}${new URL(inviteInput.trim()).hash}`);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = messageText.trim();
    const socket = socketRef.current;
    if (!text || text.length > 1000 || !invite || !socket?.connected || !connected) return;

    try {
      const key = await importRoomKey(invite.key);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          id: crypto.randomUUID(),
          senderId: senderIdRef.current,
          alias,
          text,
          time: new Date().toISOString(),
        }),
      );
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
      socket.emit("room:message", {
        roomId: invite.roomId,
        payload: {
          iv: bytesToBase64Url(iv),
          ciphertext: bytesToBase64Url(new Uint8Array(ciphertext)),
        },
      });
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), alias, text, time: new Date().toISOString() },
      ].slice(-100));
      setMessageText("");
      setError("");
    } catch {
      setError("Your message could not be encrypted or sent. Please try again.");
    }
  }

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setNotice("Invite link copied. Only share it with someone you trust.");
    } catch {
      setError("Could not access the clipboard. Copy the invitation from your browser address bar.");
    }
  }

  function exportChat() {
    const transcript = messages
      .map((message) => `${message.time} — ${message.alias}: ${message.text}`)
      .join("\n");
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "she-deserves-private-chat.txt";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Chat transcript exported to this device. The file is not encrypted.");
  }

  function leaveRoom() {
    socketRef.current?.disconnect();
    setInvite(null);
    setInviteLink("");
    setMessages([]);
    setParticipantCount(0);
    setConnected(false);
    setMessageText("");
    setInviteInput("");
    setError("");
    setNotice("You left the room and cleared this tab’s chat history.");
    window.history.replaceState(null, "", `${window.location.origin}${window.location.pathname}${window.location.search}#peer-chat`);
  }

  return (
    <section id="peer-chat" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8DDEB] text-plum">
            <MessageCircleHeart aria-hidden="true" size={23} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-plum">PRIVATE PEER CHAT</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-midnight sm:text-4xl">
            Talk together, without signing up.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-midnight/75">
            Create an invite-only room or join with a private link. Messages are encrypted in your
            browser before they travel to the relay.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-midnight/75">
            <li className="flex gap-2"><Check className="mt-1 shrink-0 text-sage" size={16} aria-hidden="true" /> Your alias and messages stay in this tab.</li>
            <li className="flex gap-2"><Check className="mt-1 shrink-0 text-sage" size={16} aria-hidden="true" /> The server relays encrypted messages but does not store them.</li>
            <li className="flex gap-2"><Check className="mt-1 shrink-0 text-sage" size={16} aria-hidden="true" /> Up to 12 people can join the same private room.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-[#D99A2B]/40 bg-[#FFF8E9] p-4 text-sm leading-6 text-midnight/80">
            <p className="font-bold">A private link is a room key.</p>
            <p className="mt-1">
              Anyone with it can read and join. Share it privately, avoid identifying details, and
              leave if anything feels unsafe. This early chat does not yet include human moderators
              or a confidential report channel.
            </p>
          </div>
          <p className="mt-4 text-xs leading-5 text-midnight/75">
            End-to-end encryption uses AES-GCM in your browser. This prototype has not had an
            independent security review. A deployed service must use HTTPS and trusted hosting.
          </p>
        </div>

        <div className="rounded-[26px] border border-plum/10 bg-white p-5 shadow-card sm:p-7">
          {!ageConfirmed ? (
            <div className="rounded-2xl bg-[#F4EDF5] p-5 sm:p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-plum">
                <UsersRound aria-hidden="true" size={19} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-midnight">Peer chat is for adults</h3>
              <p className="mt-2 text-sm leading-6 text-midnight/75">
                This private chat is intended for adults aged 18 or older. Continuing is a
                self-attestation only; it does not verify age or create an account.
              </p>
              <button
                type="button"
                onClick={() => setAgeConfirmed(true)}
                className="mt-5 min-h-12 w-full rounded-full bg-plum px-5 text-sm font-bold text-white hover:bg-[#3D2449]"
              >
                I confirm I am 18 or older
              </button>
            </div>
          ) : !invite ? (
            <div>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8DDEB] text-plum">
                  <UsersRound aria-hidden="true" size={19} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-midnight">Start a private conversation</h3>
                  <p className="mt-1 text-sm leading-6 text-midnight/70">
                    Choose a private one-to-one chat or invite a small group. No public room directory.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={createRoom}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-plum px-5 text-sm font-bold text-white hover:bg-[#3D2449]"
              >
                <LockKeyhole aria-hidden="true" size={17} />
                Create a private chat room
              </button>
              <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-midnight/65">
                <span className="h-px flex-1 bg-plum/10" /> or join an existing room <span className="h-px flex-1 bg-plum/10" />
              </div>
              <form onSubmit={joinRoom} className="space-y-3">
                <label htmlFor="invite-link" className="block text-sm font-semibold text-midnight">
                  Private invitation link
                </label>
                <input
                  id="invite-link"
                  type="url"
                  autoComplete="url"
                  value={inviteInput}
                  onChange={(event) => setInviteInput(event.target.value)}
                  placeholder="Paste an invitation link"
                  className="min-h-12 w-full rounded-xl border border-plum/20 bg-cream px-4 text-sm text-midnight placeholder:text-midnight/60"
                />
                <button
                  type="submit"
                  className="min-h-11 w-full rounded-full border border-plum/25 px-5 text-sm font-bold text-plum hover:bg-[#F4EDF5]"
                >
                  Join private chat
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-plum/10 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-midnight">Private room</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-midnight/75">
                    <span className={`h-2 w-2 rounded-full ${connected ? "bg-sage" : "bg-amber"}`} aria-hidden="true" />
                    {connected ? `${participantCount} ${participantCount === 1 ? "person" : "people"} here` : "Connecting securely…"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={leaveRoom}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-plum/20 px-4 text-sm font-bold text-plum hover:bg-plum/5"
                >
                  <LogOut aria-hidden="true" size={16} />
                  Leave & clear
                </button>
              </div>
              <div
                ref={listRef}
                aria-live="polite"
                aria-label="Encrypted chat messages"
                className="my-4 flex h-64 flex-col gap-3 overflow-y-auto rounded-2xl bg-cream p-4"
              >
                {messages.length === 0 ? (
                  <p className="m-auto max-w-xs text-center text-sm leading-6 text-midnight/70">
                    {connected
                      ? "You’re connected. Say only what feels comfortable."
                      : "Connecting to your private room…"}
                  </p>
                ) : (
                  messages.map((message) => (
                    <article key={message.id} className="max-w-[90%] self-start rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-bold text-plum">{message.alias}</p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-midnight">{message.text}</p>
                      <time className="mt-1 block text-[11px] text-midnight/65" dateTime={message.time}>
                        {new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(message.time))}
                      </time>
                    </article>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <label htmlFor="chat-message" className="sr-only">Write an encrypted message</label>
                <input
                  id="chat-message"
                  maxLength={1000}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Write a message…"
                  disabled={!connected}
                  className="min-h-12 min-w-0 flex-1 rounded-full border border-plum/20 bg-white px-4 text-sm text-midnight placeholder:text-midnight/60 disabled:bg-cream"
                />
                <button
                  type="submit"
                  disabled={!connected || !messageText.trim()}
                  className="min-h-12 rounded-full bg-plum px-5 text-sm font-bold text-white hover:bg-[#3D2449] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyInvite}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-plum/20 px-4 text-xs font-bold text-plum hover:bg-plum/5"
                >
                  <Clipboard aria-hidden="true" size={15} />
                  Copy invite link
                </button>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={exportChat}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-plum/20 px-4 text-xs font-bold text-plum hover:bg-plum/5"
                  >
                    <ArrowUpRight aria-hidden="true" size={15} />
                    Export chat
                  </button>
                )}
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-plum/20 px-4 text-xs font-bold text-plum hover:bg-plum/5"
                  >
                    <Trash2 aria-hidden="true" size={15} />
                    Clear history
                  </button>
                )}
              </div>
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-midnight/75">
                <LockKeyhole className="mt-0.5 shrink-0 text-teal" aria-hidden="true" size={14} />
                Messages are only in memory in this tab. The room key is in the invite link — keep it private.
              </p>
            </div>
          )}
          {error && <p role="alert" className="mt-4 rounded-xl bg-[#F4EDF5] p-3 text-sm font-medium text-plum">{error}</p>}
          {notice && <p role="status" className="mt-4 rounded-xl bg-[#EDF4EE] p-3 text-sm font-medium text-[#315E3B]">{notice}</p>}
          <p className="mt-4 flex items-start gap-2 border-t border-plum/10 pt-4 text-xs leading-5 text-midnight/75">
            <ShieldAlert className="mt-0.5 shrink-0 text-plum" aria-hidden="true" size={15} />
            Peer chat is not monitored or emergency support. Avoid identifying details. For urgent help, use Crisis help.
          </p>
        </div>
      </div>
    </section>
  );
}
