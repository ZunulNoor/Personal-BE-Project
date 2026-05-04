const express = require('express');
const http = require('http');
const db = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // ✅ Wrap app for socket.io

const io = socketIO(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

const userRouter = require('./API/User/Router');
const messageRouter = require('./API/Messages/Router');
const { handleSocketConnection } = require('./API/Messages/Controller');

const port = 2500;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', userRouter);
app.use('/api', messageRouter);

app.get('/', (req, res) => {
  res.send('Chatting App API');
});

// ✅ Setup Socket.IO once
io.on('connection', (socket) => {
  handleSocketConnection(io, socket);
});

// ✅ Connect MongoDB and then start server
db.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");

  server.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
})
.catch((err) => {
  console.log("❌ MongoDB connection error:", err);
});
