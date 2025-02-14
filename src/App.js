import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import AddNote from "./views/AddNote";
import NoteDetail from "./views/NoteDetail";
import { v4 as uuidv4 } from "uuid"; // Generowanie unikalnych ID
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [location, setLocation] = useState(null);

  // Zapisywanie notatek w localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Pobranie lokalizacji użytkownika
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
            console.error("Błąd pobierania lokalizacji:", error);
            setLocation({ latitude, longitude, city: "Nieznane miasto" });
          }
        },
        (error) => {
          console.error("Błąd geolokalizacji:", error);
        }
      );
    }
  }, []);

  // Funkcja do pokazywania powiadomień
  const showNotification = (title, options) => {
    if (navigator.serviceWorker && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  };

  // Funkcja do żądania pozwolenia na powiadomienia
  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Powiadomienia zostały włączone.");
        }
      });
    }
  };

  // Dodawanie notatki
  const addNoteWithLocation = (note) => {
    if (Notification.permission !== "granted") {
      requestNotificationPermission();
    }

    const noteWithLocation = {
      id: uuidv4(), // Unikalne ID
      ...note,
      location: location?.city || "Nieznane miasto",
    };
    setNotes((prevNotes) => [...prevNotes, noteWithLocation]);
    showNotification("Notatka dodana!", {
      body: `Dodano notatkę: ${note.title}`,
      icon: "/icon.png",
    });
  };

  // Usuwanie notatki
  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    showNotification("Notatka usunięta!", {
      body: "Notatka została usunięta.",
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

// Rejestracja Service Workera z automatycznym odświeżaniem
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker zarejestrowany:", registration.scope);

        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("Nowa wersja dostępna. Odśwież stronę.");
            }
          };
        };
      })
      .catch((error) => {
        console.error("Błąd rejestracji Service Workera:", error);
      });
  });
}
