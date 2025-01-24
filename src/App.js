// Główna struktura aplikacji
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import AddNote from "./views/AddNote";
import NoteDetail from "./views/NoteDetail";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Nieznane miasto";
            setLocation({ latitude, longitude, city });
          } catch (error) {
            console.error("Error fetching location data:", error);
            setLocation({ latitude, longitude, city: "Nieznane miasto" });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Powiadomienia zostały włączone.");
        } else {
          console.log("Powiadomienia zostały odrzucone.");
        }
      });
    }
  }, []);

  const showNotification = (title, options) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  const addNoteWithLocation = (note) => {
    const noteWithLocation = {
      ...note,
      location: location?.city || "Nieznane miasto",
    };
    setNotes((prevNotes) => [...prevNotes, noteWithLocation]);
    showNotification("Notatka dodana!", {
      body: `Dodano notatkę: ${note.title}`,
      icon: "/icon.png",
    });
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
    showNotification("Notatka usunięta!", {
      body: `Notatka została usunięta.`,
      icon: "/icon.png",
    });
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Notatnik</h1>
          <nav>
            <Link to="/">Lista notatek</Link>
            <Link to="/add">Dodaj notatkę</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home notes={notes} />} />
            <Route
              path="/add"
              element={<AddNote addNote={addNoteWithLocation} />}
            />
            <Route
              path="/note/:id"
              element={<NoteDetail notes={notes} deleteNote={deleteNote} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// Service Worker i Manifest
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
