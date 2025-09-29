import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ResultsChart from "../components/ResultsChart";

const socket = io("http://localhost:5000");

export default function PollRoom() {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false); // toggle popup
  const timerRef = useRef(null);
  const studentName = localStorage.getItem("studentName");

  // Fetch current poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch("http://localhost:5000/polls/current");
        if (!res.ok) return;
        const data = await res.json();
        setPoll(data);
        setResults(data.options);
        setParticipants(data.participants || []);
        setTimeLeft(data.timeLimit || 60);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPoll();
  }, []);

  // Socket.io events
  useEffect(() => {
    socket.on("newPoll", (data) => {
      setPoll(data);
      setResults(data.options);
      setParticipants(data.participants || []);
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(data.timeLimit || 60);
    });

    socket.on("pollResults", (data) => {
      setResults(data);
      if (poll) setParticipants(poll.participants || []);
    });

    return () => {
      socket.off("newPoll");
      socket.off("pollResults");
    };
  }, [poll]);

  // Countdown timer
  useEffect(() => {
    if (!poll || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [poll, submitted]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option");
      return;
    }
    socket.emit("submitVote", { studentName, optionIndex: selectedOption });
    setSubmitted(true);
    clearInterval(timerRef.current);
  };

  if (!studentName) return <p>Please enter your name first!</p>;
  if (!poll) return <p>Waiting for a poll...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Poll Room</h1>
      <div style={{ border: "2px solid #007bff", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>{poll.question}</h2>
        <p style={{ color: "gray", fontSize: "14px" }}>Time Left: {timeLeft}s</p>
      </div>

      {!submitted ? (
        <div>
          {poll.options.map((opt, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: selectedOption === idx ? "#d1e7dd" : "#f8f9fa",
                cursor: "pointer",
              }}
              onClick={() => setSelectedOption(idx)}
            >
              {opt.text}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || timeLeft === 0}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: selectedOption === null ? "not-allowed" : "pointer",
            }}
          >
            Submit Answer
          </button>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Participants ({participants.length})
            </button>
            {showParticipants && (
              <ul style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                {participants.length === 0 ? (
                  <li>No participants yet</li>
                ) : (
                  participants.map((name, idx) => <li key={idx}>{name}</li>)
                )}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h3>Live Results:</h3>
          <ResultsChart options={results} />

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Participants ({participants.length})
            </button>
            {showParticipants && (
              <ul style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                {participants.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
