import { useState } from "react";
import "./App.css";
import { useSocket } from "./context/SourceProvider";

function App() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col justify-between bg-[#111] text-white rounded-2xl shadow-2xl border border-gray-800 p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">⚡ Chat Room</h1>

        <div className="flex-grow overflow-y-auto bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg max-w-full break-words w-fit"
              >
                {msg}
              </div>
            ))
          )}
        </div>

        <div className="flex mt-4 gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg bg-[#222] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
