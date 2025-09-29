import React, { useState, useEffect } from "react";
import CreatePollForm from "../components/CreatePollForm";
import ResultsChart from "../components/ResultsChart";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function TeacherDashboard() {
  const [poll, setPoll] = useState(null);
  const [addQuestion, setAddQuestion] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    socket.on("newPoll", (data) => {
      setPoll(data);
      setResults(data.options);
    });
    socket.on("pollResults", (data) => setResults(data));
    socket.on("pollEnded", () => {
      setPoll(null);
      fetchHistory();
    });
    socket.on("newParticipant", (name) => {
      if (poll && !poll.participants.includes(name)) {
        setPoll({ ...poll, participants: [...poll.participants, name] });
      }
    });

    fetchHistory();

    return () => {
      socket.off("newPoll");
      socket.off("pollResults");
      socket.off("pollEnded");
      socket.off("newParticipant");
    };
  }, [poll]);

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/polls/history");
    if (res.ok) setHistory(await res.json());
  };

  const handleCreatePoll = async (pollData) => {
    const res = await fetch("http://localhost:5000/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollData),
    });
    if (res.ok) setPoll((await res.json()).poll);
    setAddQuestion(false);
  };

  const handleEndPoll = () => socket.emit("endPoll");

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Teacher Dashboard</h1>

      <button
        onClick={() => setAddQuestion(!addQuestion)}
        style={{ marginBottom: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        {addQuestion ? "Hide Question Form" : "Add Question"}
      </button>

      {addQuestion && <CreatePollForm onCreate={handleCreatePoll} />}

      {poll && (
        <div style={{ border: "1px solid #007bff", padding: "15px", borderRadius: "10px", marginTop: "20px" }}>
          <h2>Current Poll:</h2>
          <p><strong>Question:</strong> {poll.question}</p>
          <ResultsChart options={results} />

          {/* Participants button */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Participants ({poll.participants.length})
          </button>

          {showParticipants && (
            <ul style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
              {poll.participants.length === 0 ? (
                <li>No participants yet</li>
              ) : (
                poll.participants.map((name, idx) => <li key={idx}>{name}</li>)
              )}
            </ul>
          )}

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleEndPoll}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              End Poll
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Poll History</h2>
          {history.map((p) => (
            <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", borderRadius: "8px" }}>
              <p><strong>Question:</strong> {p.question}</p>
              <ResultsChart options={p.options} />
              <p><strong>Participants:</strong> {p.participants.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

