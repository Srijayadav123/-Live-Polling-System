import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentJoin from "./pages/StudentJoin";
import PollRoom from "./pages/PollRoom";
import RoleSelect from "./pages/RoleSelect"; // NEW

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />  {/* Landing page */}
      <Route path="/student-join" element={<StudentJoin />} />
      <Route path="/poll-room" element={<PollRoom />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

