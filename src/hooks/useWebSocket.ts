import { RootState } from "@/store/store";
import { Chat, Message } from "@/types/messages";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // in ms

export const useWebSocket = (wsUrl: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const messageQueueRef = useRef<any[]>([]); // ✅ Holds unsent messages
  const [lastMessage, setLastMessage] = useState<any>(null); // optional if needed
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  const connect = () => {
    socketRef.current = new WebSocket(
      `wss://property-h7dfbwhyccdcdagr.eastus2-01.azurewebsites.net${wsUrl}?token=${token}`
    );
    const ws = socketRef.current;

    ws.onopen = () => {
      console.log("✅ WebSocket connected:", wsUrl);
      setConnected(true);
      retryCountRef.current = 0;

      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

      // ✅ Flush queued messages
      messageQueueRef.current.forEach((msg) => {
        ws.send(JSON.stringify(msg));
      });
      messageQueueRef.current = [];
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected");
      setConnected(false);
      if (retryCountRef.current < MAX_RETRIES) {
        reconnectTimerRef.current = setTimeout(() => {
          retryCountRef.current++;
          connect();
        }, RETRY_DELAY);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      ws.close();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "list_messages") {
        setMessages(data.messages);
        setLoadingMessages(false);
      } else if (data.action === "list_chats") {
        setChats(data.chats);
        setLoadingChats(false);
      } else if (data.action === "new_message") {
        setIsSendingMessage(false);
        setMessages((prev) => [...prev, data.message]);
        //update chat list locally
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === data.message.chat_id
              ? {
                  ...chat,
                  last_message: {
                    ...chat.last_message,
                    content: data.message.content,
                    timestamp: data.message.timestamp,
                  },
                }
              : chat
          )
        );
      }

      setLastMessage(data);
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const sendMessage = (recipient: number, content: string) => {
    const message = {
      action: "send_message",
      recipient,
      content,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      setIsSendingMessage(true);
    } else {
      console.warn("⏳ Socket not open. Queuing message...");
      messageQueueRef.current.push(message);
    }
  };

  const listMessages = (chatId: number) => {
    const message = {
      action: "list_messages",
      chat_id: chatId,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      setLoadingMessages(true);
    } else {
      console.warn("⏳ Socket not open. Queuing listMessages...");
      messageQueueRef.current.push(message);
    }
  };

  const listChats = () => {
    const message = {
      action: "list_chats",
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("⏳ Socket not open. Queuing listChats...");
      messageQueueRef.current.push(message);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sendMessage,
    listMessages,
    listChats,
    connected,
    lastMessage,
    messages,
    isSendingMessage,
    chats,
    loadingMessages,
    loadingChats,
  };
};
