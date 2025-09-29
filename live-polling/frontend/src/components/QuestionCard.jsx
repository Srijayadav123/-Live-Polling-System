import React, { useState } from "react";

export default function QuestionCard({ question, options, onSubmit }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="question-card">
      <h3>{question}</h3>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            <label>
              <input
                type="radio"
                name="poll-option"
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} disabled={selected === null}>
        Submit Answer
      </button>
    </div>
  );
}
