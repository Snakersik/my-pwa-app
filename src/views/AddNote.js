import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNote({ addNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote({ title, content });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj notatkę</h2>
      <div>
        <label>Tytuł</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Treść</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Dodaj</button>
    </form>
  );
}

export default AddNote;
