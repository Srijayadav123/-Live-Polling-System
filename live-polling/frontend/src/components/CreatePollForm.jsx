import React, { useState } from "react";

export default function CreatePollForm({ onCreate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some((opt) => !opt.trim())) return;
    onCreate({ question, options });
    setQuestion("");
    setOptions(["", ""]);
  };

  return (
    <form onSubmit={handleSubmit} className="poll-form">
      <h3>Create a New Poll</h3>
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />

      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(e.target.value, idx)}
          required
        />
      ))}

      <button type="button" onClick={addOption}>
        + Add Option
      </button>
      <button type="submit">Create Poll</button>
    </form>
  );
}
