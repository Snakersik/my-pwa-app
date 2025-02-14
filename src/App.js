import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import AddNote from "./views/AddNote";
import NoteDetail from "./views/NoteDetail";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [location, setLocation] = useState(null);
  const [swRegistration, setSwRegistration] = useState(null);

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

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker zarejestrowany:", registration.scope);
          setSwRegistration(registration);

          // Nasłuchujemy wiadomości z Service Workera
          navigator.serviceWorker.addEventListener("message", (event) => {
            const { title, body } = event.data;
            console.log("Otrzymano wiadomość z SW:", title, body);
          });
        })
        .catch((error) => {
          console.error("Błąd rejestracji Service Workera:", error);
        });
    }
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Powiadomienia:", permission);
      });
    }
  };

  const showNotification = (title, options) => {
    if (swRegistration && swRegistration.active) {
      // Wysyłanie komunikatu do Service Workera
      swRegistration.active.postMessage({
        action: "showNotification",
        title: title,
        options: options,
      });
    }
  };

  const addNoteWithLocation = (note) => {
    if (Notification.permission === "default") {
      requestNotificationPermission();
    }

    const newNote = {
      id: uuidv4(),
      ...note,
      location: location?.city || "Nieznane miasto",
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);

    // Powiadomienie lokalne po dodaniu notatki
    showNotification("Notatka dodana!", {
      body: `Dodano notatkę: ${note.title}`,
      icon: "/icon.png",
    });
  };

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
