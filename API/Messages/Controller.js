const ChatMessage = require("./Model");

const getMessage = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("getMessage Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    const chatMessage = new ChatMessage({ user, message });
    await chatMessage.save();

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("sendMessage Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ========== SOCKET.IO CONTROLLERS ==========

const handleSocketConnection = (io, socket) => {
  console.log("🔌 New socket connected:", socket.id);

  // Listen for real-time message sending
  socket.on("sendMessage", async (data) => {
    try {
      const { user, message } = data;

      if (!user || !message) {
        console.warn("Missing user or message in socket event");
        return;
      }

      const chatMessage = new ChatMessage({ user, message });
      await chatMessage.save();

      // Broadcast message to all users
      io.emit("receiveMessage", chatMessage);
    } catch (error) {
      console.error("Socket sendMessage Error:", error);
    }
  });

  // Optional: send chat history to the user
  socket.on("getMessages", async () => {
    try {
      const messages = await ChatMessage.find().sort({ timestamp: 1 });
      socket.emit("previousMessages", messages);
    } catch (error) {
      console.error("Socket getMessages Error:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
};

module.exports = {
  getMessage,
  sendMessage,
  handleSocketConnection
};
