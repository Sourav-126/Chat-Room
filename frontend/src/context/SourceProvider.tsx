import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
interface SocketProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("No Connection found");
  }
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message: msg }));
      } else {
        console.warn("WebSocket is not ready.");
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((msg: string) => {
    const { message } = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, message]);
  }, []);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      onMessageReceived(e.data);
    };

    ws.onclose = () => {
      console.warn(" WebSocket closed");
      setSocket(null);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [onMessageReceived]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
