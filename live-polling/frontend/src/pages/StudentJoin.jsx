import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim()) return alert("Please enter your name");
    // Store name in sessionStorage for the poll
    sessionStorage.setItem("studentName", name);
    navigate("/poll-room");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Join Poll</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button
        onClick={handleJoin}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        Join Poll
      </button>
    </div>
  );
}
