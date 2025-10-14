import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const BASE_URL = "http://localhost:4050/api";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/message/list`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">
        Messages
      </h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                onClick={() => setSelectedMessage(msg)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold">{msg.name}</h3>
                <p className="text-gray-400 text-sm">{msg.email}</p>
                <p className="text-gray-300 text-sm mt-1">
                  {msg.description.length > 50
                    ? msg.message.substring(0, 50) + "..."
                    : msg.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="bg-gray-800 p-6 rounded-lg min-h-[200px]">
            {selectedMessage ? (
              <>
                <h3 className="text-xl font-semibold mb-2">{selectedMessage.name}</h3>
                <p className="text-gray-400 mb-2">{selectedMessage.email}</p>
                <p className="text-gray-200">{selectedMessage.message}</p>
              </>
            ) : (
              <p className="text-gray-400 text-center mt-10">
                Click on a message to view its full content.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Messages;
