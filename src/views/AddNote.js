import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function AddNote({ addNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      alert("Tytuł i treść nie mogą być puste!");
      return;
    }

    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
    };

    addNote(newNote);
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
