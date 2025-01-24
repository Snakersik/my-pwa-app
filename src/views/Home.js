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
          {notes.map((note, index) => (
            <li key={index}>
              <Link to={`/note/${index}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
