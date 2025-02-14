import React from "react";
import { Link } from "react-router-dom";

function Home({ notes }) {
  return (
    <div>
      <h2>Lista notatek</h2>
      {notes.length === 0 ? (
        <p>Brak notatek. Dodaj swoją pierwszą notatkę!</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Link to={`/note/${note.id}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
