import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function NoteDetail({ notes, deleteNote }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return <p>Notatka nie została znaleziona!</p>;
  }

  const handleDelete = () => {
    deleteNote(id);
    navigate("/");
  };

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      {note.location && (
        <p>
          <strong>Lokalizacja:</strong> {note.location}
        </p>
      )}
      <button onClick={handleDelete}>Usuń notatkę</button>
    </div>
  );
}

export default NoteDetail;
