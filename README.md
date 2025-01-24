Notatnik - Progressive Web App (PWA)

Funkcjonalności

##Główne funkcje:

Dodawanie notatek: Możliwość tworzenia notatek wraz z informacją o lokalizacji użytkownika.

Wyświetlanie listy notatek: Podgląd wszystkich zapisanych notatek.

Szczegóły notatek: Wyświetlanie szczegółów notatki z możliwością jej usunięcia.

Tryb offline: Aplikacja działa bez połączenia z Internetem, dzięki zastosowaniu Service Workera.

Geolokalizacja: Automatyczne przypisywanie lokalizacji do każdej notatki.

Powiadomienia: Systemowe powiadomienia informujące o dodaniu lub usunięciu notatki.

##Technologie

Aplikacja została zbudowana przy użyciu następujących technologii:

React: Biblioteka JavaScript do budowy interfejsów użytkownika.

React Router: Zarządzanie trasami w aplikacji.

Service Worker: Obsługa cache i funkcjonalności offline.

Geolocation API: Uzyskiwanie lokalizacji użytkownika.

Web Notifications API: Wysyłanie powiadomień systemowych.

##Instalacja i uruchomienie

Wymagania

Node.js w wersji 16 lub nowszej

Menedżer pakietów npm lub yarn

Instrukcja uruchomienia

Sklonuj repozytorium

git clone https://github.com/Snakersik/my-pwa-app
cd my-pwa-app

Zainstaluj zależności

npm install

Uruchom aplikację

npm start

Zbuduj wersję produkcyjną

npm run build

Pliki zostaną zapisane w folderze build/

Aplikacja została wyhostowana na Netlify
https://fluffy-peony-a1cb7a.netlify.app
