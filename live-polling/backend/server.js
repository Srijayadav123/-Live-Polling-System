import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let polls = []; // store polls in-memory

// Create new poll
app.post("/polls", (req, res) => {
  const { question, options } = req.body;
  const poll = {
    id: uuidv4(),
    question,
    options: options.map((o) => ({ text: o.text, votes: 0 })),
    participants: [],
    votesByStudent: {},
  };
  polls.push(poll);
  io.emit("newPoll", poll);
  res.json({ poll });
});

// Fetch poll history
app.get("/polls/history", (req, res) => {
  res.json(polls);
});

// End current poll
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinPoll", ({ pollId, name }) => {
    const poll = polls.find((p) => p.id === pollId);
    if (poll && !poll.participants.includes(name)) {
      poll.participants.push(name);
      io.emit("newParticipant", name);
    }
  });

  socket.on("submitAnswer", ({ pollId, studentName, selectedOption }) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;

    // Update votes
    const option = poll.options.find((o) => o.text === selectedOption);
    if (option) option.votes += 1;

    // Track student votes
    poll.votesByStudent[studentName] = selectedOption;

    // Broadcast updated results
    io.emit("pollResults", { options: poll.options, votesByStudent: poll.votesByStudent });
  });

  socket.on("endPoll", () => {
    io.emit("pollEnded");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
