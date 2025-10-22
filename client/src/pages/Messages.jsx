import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const BASE_URL = "http://localhost:4050/api";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/message/list`);
      // Normalize data and sort latest first
      const sorted = res.data
        .map((msg) => ({
          ...msg,
          read: msg.read || false,
          createdAt: msg.createdAt || msg.updatedAt || null,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sorted);
    } catch (err) {
      console.error(err);
      setError("Error fetching messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${BASE_URL}/message/delete/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete the message.");
    }
  };

  const handleSelect = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await axios.patch(`${BASE_URL}/message/read/${msg._id}`);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    }
  };

  // ✅ Safe date formatting
  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  // ✅ Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = msg.createdAt
      ? new Date(msg.createdAt).toDateString()
      : "Unknown Date";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  // Sort groups (newest date first)
  const sortedGroupKeys = Object.keys(groupedMessages).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 tracking-wide text-blue-400">
        Messages
      </h2>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <p className="text-center text-gray-400">No messages found.</p>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* 📨 Message List */}
          <div className="col-span-1 max-h-[70vh] overflow-y-auto pr-2 space-y-6">
            {sortedGroupKeys.map((dateKey) => (
              <div key={dateKey}>
                <h4 className="text-gray-400 font-semibold mb-2">
                  {dateKey === new Date().toDateString() ? "Today" : dateKey}
                </h4>
                <div className="space-y-4">
                  {groupedMessages[dateKey]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((msg) => (
                      <motion.div
                        key={msg._id}
                        className={`bg-gray-800 p-4 rounded-2xl cursor-pointer transition-shadow flex justify-between items-start gap-3 hover:shadow-xl hover:bg-gray-700 ${
                          selectedMessage?._id === msg._id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSelect(msg)}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-semibold text-lg truncate">
                              {msg.name}
                            </h3>
                            <span
                              className={`h-3 w-3 rounded-full mt-1 ${
                                msg.read
                                  ? "bg-gray-500"
                                  : "bg-green-400 animate-pulse"
                              }`}
                              title={msg.read ? "Read" : "Unread"}
                            ></span>
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {msg.email}
                          </p>
                          <p className="text-gray-300 text-sm mt-1 line-clamp-3">
                            {msg.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {formatDateTime(msg.createdAt || msg.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(msg._id);
                          }}
                          className="text-red-500 hover:text-red-400 transition self-start"
                          title="Delete Message"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* 📄 Message Detail */}
          <motion.div
            className="col-span-2 bg-gray-800 p-6 rounded-2xl min-h-[70vh] shadow-xl flex flex-col overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {selectedMessage ? (
              <>
                <h3 className="text-3xl font-bold mb-3 text-blue-300 break-words">
                  {selectedMessage.name}
                </h3>
                <p className="text-gray-400 mb-4 break-words">
                  {selectedMessage.email}
                </p>
                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </p>
                <p className="text-gray-500 mt-auto text-sm">
                  Received:{" "}
                  {formatDateTime(
                    selectedMessage.createdAt || selectedMessage.updatedAt
                  )}
                </p>
              </>
            ) : (
              <p className="text-gray-400 text-center mt-10 text-lg">
                Click on a message to view its full content.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Messages;
