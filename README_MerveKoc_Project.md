
# Projektbeschreibung: Polario Mitarbeiter Portal

## Inhaltsverzeichnis

- [Projektziel](#projektziel)
- [Planung ](#planung)
- [Verwendete Technologien](#verwendete-technologien)
- [Projektstruktur](#projektstruktur)
- [Projekt ausführen](#projekt-ausführen)
- [Demo-Zugangsdaten](#demo-zugangsdaten)
- [Verwendete Hauptmodule](#verwendete-hauptmodule)
- [Sicherheitsfeatures & Validierungen](#sicherheitsfeatures--validierungen)
- [Backend – index.js](#backend--indexjs)
- [Environment-Dateien](#environment-dateien)
- [Unit Tests](#unit-tests)
- [Zusammenfassung](#zusammenfassung)
- [Autorin](#autorin)


## Projektziel

Dieses Projekt wurde entwickelt, um die interne Kommunikation und Organisation in einem Unternehmen zu verbessern.  
Das Ziel ist es, ein **einfaches und sicheres Portal** bereitzustellen, in dem:

- **Admins** Mitarbeiter verwalten und **öffentliche Events** erstellen können.
- **Benutzer** ihr **eigenes Profil** pflegen, persönliche Events verwalten und an öffentlichen Events teilnehmen können.

Die Anwendung basiert auf einer klaren Rollenverteilung (Admin/User) und bietet Funktionen wie Anmeldung, Profilbearbeitung, Event-Teilnahme und Passwortänderung.  
Alle Daten werden sicher über **Firebase** und eine externe **MockAPI** verarbeitet.

---
## Planung 
### Use-Case-Diagramm & Pseudo-Code

Zur Planung der Benutzerrollen und Anwendungsfunktionen wurde ein **Use-Case-Diagramm** erstellt:

- Use-Case-Diagramm: [`MerveKoc_Polario.drawio`](./MerveKoc_Polario.drawio)
- PDF-Version: [`MerveKoc_Polario.drawio.pdf`](./MerveKoc_Polario.drawio.pdf)

Für einen klaren Ablauf wurde **ein PseudoCode-Dokument** erstellt:

- Pseudo-Code: [`PseudoCode.txt`](./PseudoCode.txt)

## Verwendete Technologien

### Frontend
| Technologie                  | Beschreibung                                     |
|------------------------------|--------------------------------------------------|
| **Angular 17**               | Frontend-Framework                               |
| **TypeScript**               | Programmiersprache für Angular                   |
| **Firebase Authentication**  | Authentifizierung und Nutzerverwaltung           |
| **MockAPI**                  | REST-Schnittstelle für Benutzer und Events       |
| **RxJS**                     | Reaktive Programmierung                          |
| **HTML5 / CSS3**             | Struktur und Styling                             |
| **Angular CLI**              | Build-, Test- und Entwicklungs-Tool              |

### Backend
| Technologie                  | Beschreibung                                     |
|------------------------------|--------------------------------------------------|
| **Node.js**                  | JavaScript-Laufzeitumgebung                      |
| **Express.js**               | HTTP Server-Framework                            |
| **Firebase Admin SDK**       | Serverseitige Firebase-Integration               |

### Testing
| Technologie                  | Beschreibung                                     |
|------------------------------|--------------------------------------------------|
| **Jasmine**                  | Framework für Unit-Tests in Angular              |
| **Karma**                    | Test-Runner, führt Tests im Browser aus          |
| **TestBed**                  | Angular-eigenes Testmodul zur Komponentenprüfung |
| **SpyObj (Jasmine)**         | Erlaubt das Mocking von Services in Tests        |
| **Mock-Daten & -Services**   | Für isolierte Tests ohne echte HTTP-Anfragen     |
| **ng test**                  | CLI-Befehl zum Ausführen der Tests               |

---

## Projektstruktur

```
my_Project_Polario/
│
├── backend/                  # Node.js Backend
│   ├── index.js              # Server-Einstiegspunkt
│   └── serviceAccountKey.json
│
├── src/                      # Angular-Frontend
│   ├── app/
│   │   ├── auth/             # Login, Registrierung
│   │   ├── dashboard/        # Benutzer-Dashboard
│   │   ├── user/             # Benutzerlisten (Admins)
│   │   ├── add-user/         # Benutzer hinzufügen
│   │   ├── services/         # Auth, Event, User Services
│   │   ├── guards/           # Routen-Guards
│   │   └── models/           # Interfaces: User, Event
│   ├── assets/
│   ├── environments/
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Projekt ausführen

### Frontend starten

```bash
cd Polario_MerveKoc
npm install
ng serve
```

Öffne anschließend `http://localhost:4200` im Browser.

### Backend starten

```bash
cd backend
npm install express firebase-admin
node index.js
```

Backend läuft typischerweise auf `http://localhost:3000`.

---

## Demo-Zugangsdaten

**❗ Alle Konten verwenden das gleiche Passwort: Pa$$w0rd ❗**

| Rolle   | E-Mail                        |
|---------|-------------------------------|
| Admin   | admin1@benutzer.com           |
|         | admin2@benutzer.com           |
|         | admin3@benutzer.com           |
| User    | user1@benutzer.com            |
|         | user2@benutzer.com            |
|         | user3@benutzer.com            |

---
# Verwendete Hauptmodule

## Add-User-Komponent
### `add-user.component.ts`

- **`addUser()`**: Erstellt einen neuen Benutzer über ein Formular und sendet die Daten an die MockAPI.
- **`abbrechen()`**: Bricht den Vorgang ab und navigiert zurück zur vorherigen Seite oder Liste.

---

# Auth-Komponent
### `login.component.ts`

- **`selectRole()`**: Ermöglicht dem Benutzer, eine Rolle (admin oder user) auszuwählen.
- **`goToRegister()`**: Leitet zur Registrierungsseite weiter.
- **`login()`**: Meldet den Benutzer mit E-Mail und Passwort über Firebase an.

### `register.component.ts`

- **`passwordMismatch()`**: Überprüft, ob die eingegebenen Passwörter übereinstimmen.

---

# Dashboard-Komponent
### `dashboard.component.ts`

- **`ngOnInit()`**: Initialisiert die Komponente und lädt Benutzer- und Eventdaten.
- **`getAllEvents()`**: Ruft alle Events von der MockAPI ab.
- **`addEvent()`**: Erstellt ein neues Event basierend auf Benutzereingaben.
- **`editEvent(event)`**: Aktiviert den Bearbeitungsmodus für das ausgewählte Event.
- **`saveEvent()` / `updateEvent()`**: Speichert die Änderungen eines bearbeiteten Events.
- **`toggleCompleted(event)`**: Markiert ein Event als erledigt oder nicht erledigt.
- **`joinEvent(event)`**: Fügt den aktuellen Benutzer als Teilnehmer zum Event hinzu.
- **`leaveEvent(event)`**: Entfernt den aktuellen Benutzer von der Teilnehmerliste.
- **`removeParticipant(event, user)`**: Entfernt einen Teilnehmer aus einem Event (nur für Admins).
- **`toggleFavorite(event)`**: (Optional) Markiert ein Event als Favorit.
- **`sortedEvents()`**: Gibt Events sortiert nach Datum oder anderen Kriterien zurück.
- **`myEvents()`**: Gibt alle Events zurück, die vom aktuellen Benutzer erstellt wurden.
- **`publicEvents()`**: Gibt alle öffentlichen Events zurück.
- **`sort()`**: Führt eine benutzerdefinierte Sortierung der Events durch.
- **`updateProfile()`**: Aktualisiert das Benutzerprofil (Name, Avatar, E-Mail, Passwort).
- **`logout()`**: Meldet den Benutzer ab und leitet zur Login-Seite weiter.

---
## Guards-Komponent
### `auth.guard.ts`

- **Zweck**: Schützt bestimmte Routen vor unautorisiertem Zugriff.
- **Verwendung**: Nur authentifizierte Benutzer können auf bestimmte Seiten zugreifen (z. B. Dashboard,      Benutzerverwaltung).
- **Funktionsweise**:
  - Prüft, ob ein Benutzer bei Firebase eingeloggt ist.
  - Wenn nicht, wird er automatisch zur Login-Seite weitergeleitet.
---

# Header-Komponent

### `header.component.ts`

- **`ngOnInit()`**: Initialisiert die Header-Komponente und ruft aktuelle Benutzerinformationen ab.
- **`subscribe()`**: Abonniert Änderungen des Authentifizierungsstatus sowie Benutzerrolle und E-Mail.
- **`logout()`**: Meldet den Benutzer ab und beendet die aktuelle Sitzung.

---

## Services-Komponent
### `auth.service.ts`

- **`register`**: Registriert einen neuen Benutzer mit E-Mail und Passwort über Firebase.
- **`login`**: Meldet einen bestehenden Benutzer mit E-Mail und Passwort an.
- **`logout`**: Meldet den aktuellen Benutzer ab.
- **`getCurrentUser`**: Gibt Informationen über den aktuell angemeldeten Benutzer zurück.
- **`isLoggedIn`**: Prüft, ob ein Benutzer aktuell eingeloggt ist.
- **`sendEmailVerification`**: Sendet eine E-Mail zur Verifizierung an den Benutzer.
- **`updateEmail`**: Ändert die E-Mail-Adresse des aktuell angemeldeten Benutzers.
- **`updatePassword`**: Ändert das Passwort des aktuell angemeldeten Benutzers.

### `event.service.ts`

- **`getEvents`**: Lädt alle verfügbaren Events von der MockAPI.
- **`getEventsByUser`**: Lädt alle Events, die von einem bestimmten Benutzer erstellt wurden.
- **`addEvent`**: Fügt ein neues Event zur MockAPI hinzu.
- **`updateEvent`**: Aktualisiert ein bestehendes Event basierend auf der Event-ID.
- **`deleteEvent`**: Löscht ein Event basierend auf der ID.

### `user.service.ts`

- **`getUsers`**: Holt alle Benutzerinformationen von der MockAPI.
- **`addUser`**: Erstellt einen neuen Benutzer über die MockAPI.
- **`updateUser`**: Aktualisiert Benutzerdaten.
- **`deleteUser`**: Löscht einen Benutzer aus dem System.

### `toast.service.ts`

- **`showSuccess`**: Zeigt eine Erfolgsmeldung als Toast-Benachrichtigung.
- **`showError`**: Zeigt eine Fehlermeldung als Toast-Benachrichtigung.

### `shared.services.ts`

- **`setEmail`**: Speichert die E-Mail eines Benutzers zur Wiederverwendung.
- **`getEmail`**: Ruft die gespeicherte E-Mail ab.

---
## Models-Komponent
- **User**: Definiert die Benutzerdatenstruktur (Name, E-Mail, Rolle, Avatar)
- **Event**: Definiert die Eventstruktur (Titel, Beschreibung, Teilnehmerliste etc.)

### Datenmodelle

#### `user.model.ts`

Dieses Interface definiert die Struktur eines Benutzers:

| Feld           | Typ                 | Beschreibung                                     |
|----------------|---------------------|--------------------------------------------------|
| `id`           | `string`            | Eindeutige Benutzer-ID                           |
| `name`         | `string`            | Name des Benutzers                               |
| `avatar`       | `string`            | URL zum Benutzer-Avatar                          |
| `beschreibung` | `string` (optional) | Freitext über den Benutzer                       |
| `email`        | `string` (optional) | E-Mail-Adresse des Benutzers                     |
| `role`         | `'admin' | 'user'`  | Rolle des Benutzers im System                    |

---

#### `event.model.ts`

Dieses Interface definiert die Struktur eines Events:

| Feld           | Typ                  | Beschreibung                                              |
|----------------|----------------------|-----------------------------------------------------------|
| `id`           | `string`             | Eindeutige Event-ID                                       |
| `userEmail`    | `string`             | E-Mail des Erstellers                                     |
| `title`        | `string`             | Titel des Events                                          |
| `description`  | `string`             | Beschreibung des Events                                   |
| `date`         | `string`             | Datum des Events                                          |
| `completed`    | `boolean`            | Ob das Event abgeschlossen wurde                          |
| `isPublic`     | `boolean`            | Gibt an, ob das Event öffentlich ist                      |
| `createdBy`    | `string`             | Wer das Event erstellt hat                                |
| `participants` | `string[]`           | Liste der Teilnehmer (E-Mail-Adressen)                    |
| `favorite`     | `boolean` (optional) | Ob Event als Favorit markiert wurde (optional)            |
| `raum`         | `string` (optional)  | Raum, in dem das Event stattfindet (optional)             |
| `limit`        | `number` (optional)  | Maximale Anzahl an Teilnehmern (optional)                 |

**Siehe Beispiel-Code unten:**

### User

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  beschreibung: string;
  role: 'user' | 'admin';
}
```
### Event

```ts
export interface Event {
  id: string;
  userEmail: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  isPublic: boolean;
  createdBy: string;
  participants: string[];
}
```
---
# App-Dateien
## `app.component.ts`

- **Beschreibung**: Hauptkomponente der Angular-Anwendung.
- **Funktion**: Definiert das grundlegende Layout der Anwendung mit `<app-root>`.
- **Enthält**: Navigationsleiste (Header), Router-Outlet und globale UI-Struktur.

## `app.routes.ts`

- **Beschreibung**: Routing-Konfiguration für die gesamte Anwendung.
- **Funktion**:
  - Verknüpft URLs mit Komponenten wie Login, Register, Dashboard usw.
  - Wendet `authGuard` auf geschützte Routen an.
- **Beispielhafte Routen**:
  - `/login` → LoginComponent
  - `/dashboard` → DashboardComponent (geschützt)

## `app.config.ts`

- **Beschreibung**: Konfiguriert die Angular-Anwendung mit modernen APIs (z. B. `provideRouter()`).
- **Funktion**:
  - Bindet die Routing-Konfiguration ein
  - Definiert globale Anbieter, wenn notwendig
---

## Sicherheitsfeatures & Validierungen

- Firebase Auth für Login, Registrierung, Passwortänderung
- Zugriffsbeschränkung per Angular `authGuard`
- Passwort-Mindestlänge: 6 Zeichen
- E-Mail-Format-Validierung
- Nur eingeloggte Benutzer sehen das Dashboard
- Nur Admins dürfen Benutzer verwalten und öffentliche Events bearbeiten
- "Raum blockieren"-Feature mit 30-Minuten-Zeitsperre

---
## Backend – `index.js`
### Übersicht
Diese Datei initialisiert einen einfachen **Node.js/Express-Server**, der mit dem **Firebase Admin SDK** kommuniziert. Er wird verwendet, um administrative Aktionen wie das Zurücksetzen von Passwörtern durchzuführen.

### Endpoint
#### `POST /admin/reset-password`
- **Zweck**: Setzt das Passwort eines Benutzers anhand seiner E-Mail zurück.
- **Request Body**:
```json
{
  "email": "benutzer@example.com",
  "newPassword": "NeuesPasswort123"
}
```
- **Ablauf**:
  - Sucht den Benutzer über die angegebene E-Mail.
  - Aktualisiert das Passwort im Firebase-System.
  - Gibt eine Erfolgs- oder Fehlermeldung zurück.

---

## Environment-Dateien

Die Angular-Anwendung verwendet zwei Umgebungsdateien:
### `environment.ts` (Entwicklung)

- **Zweck**: Wird während der Entwicklung und beim lokalen Testen verwendet.
- **`production: false`**: Aktiviert Debug-Modus und ausführliche Fehler.
- **Firebase-Konfiguration**: Verbindet sich mit dem Firebase-Projekt `benutzer-app`.

### `environment.prod.ts` (Produktion)

- **Zweck**: Wird beim finalen Build für die Produktion verwendet.
- **`production: true`**: Deaktiviert Debug-Informationen, aktiviert Produktionsmodus.
- **Firebase-Konfiguration**: Verwendet dieselbe Firebase-Instanz wie die Entwicklungsumgebung.

### Gemeinsame Konfigurationsfelder (Firebase)

| Feld                | Beschreibung                                           |
|---------------------|--------------------------------------------------------|
| `apiKey`            | API-Schlüssel für Firebase-Zugriff                     |
| `authDomain`        | Authentifizierungsdomäne (Firebase Auth)               |
| `projectId`         | Projekt-ID in der Firebase-Konsole                     |
| `storageBucket`     | Pfad zum Firebase-Speicher                             |
| `messagingSenderId` | ID für Push-Benachrichtigungen (optional)              |
| `appId`             | Eindeutige ID der Firebase-App                         |

---

## Unit Tests

In diesem Projekt wurden Unit-Tests mit **Jasmine** und dem Test-Runner **Karma** durchgeführt, um die Funktionalität der Komponenten und Services zuverlässig zu überprüfen.

### Getestete Komponenten und Services:

| Komponente / Service  | Beschreibung                                              | Status     |
| --------------------- | --------------------------------------------------------- | ---------- |
| `AppComponent`        | Basiskomponente des Projekts                              | ✔ Getestet |
| `LoginComponent`      | Login-Logik, Rollenprüfung und Weiterleitung              | ✔ Getestet |
| `RegisterComponent`   | Passwortabgleich (passwordMismatch)                       | ✔ Getestet |
| `DashboardComponent`  | Anzeige bei erfolgreichem Login                           | ✔ Getestet |
| `UserDetailComponent` | Benutzerdaten laden mit `ActivatedRoute` und `HttpClient` | ✔ Getestet |
| `AuthService`         | Firebase AuthService Injection                            | ✔ Getestet |
| `authGuard`           | Zugriffsschutz auf Routen                                 | ✔ Getestet |

### Verwendete Techniken:

* **SpyObj** von Jasmine, um Services wie `AuthService` und `UserService` zu simulieren.
* **`of()` von RxJS**, um Observable-Antworten für Tests zu erstellen.
* **Mock-Daten** für Benutzerinformationen.
* **Standalone-Komponenten** korrekt über `imports: []` eingebunden (statt `declarations`).

### Beispiel-Test

```ts
it('sollte passwordMismatch true sein, wenn Passwörter unterschiedlich sind', () => {
  component.password = '1234';
  component.confirmPassword = 'abcd';
  expect(component.passwordMismatch).toBeTrue();
});
```

### Testausführung

Die Tests wurden mit dem Befehl ausgeführt:

```bash
ng test
```

Ergebnis:

> **✔ 10 Specs – alle erfolgreich bestanden**

## Zusammenfassung

*** Das Polario Mitarbeiter-Portal ist eine moderne und sichere Anwendung für Firmen. ***
*** Mitarbeiter können sich anmelden, ihr Profil bearbeiten und an Events teilnehmen.***
*** Admins können Benutzer verwalten und öffentliche Events erstellen. Die App ist einfach zu benutzen und hilft beim Arbeiten im Team. ***

---

## Autorin

**Merve Koc**  
Stand: Mai 2025  
Zuständig für Frontend, Backend, Projektstrukturierung und Testing.

---
