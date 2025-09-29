// src/pages/RoleSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Live Polling System</h1>
      <p>Select your role to continue:</p>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/teacher-dashboard")}
      >
        Teacher
      </button>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/student-join")}
      >
        Student
      </button>
    </div>
  );
}
