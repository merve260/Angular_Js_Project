import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model'; 

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://68076b4fe81df7060eba2b1c.mockapi.io/api/v1/events'; 

  constructor(private http: HttpClient) {}

  // Bring die Events,die der Benutzer göheren sind
  getEventsByUser(email: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}?userEmail=${email}`);
  }

  // Neue Event erstellen
  addEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  // Event löschen
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getAllEvents() {
    return this.http.get<Event[]>(`${this.apiUrl}`);
  }
  

  // Event Update
  updateEvent(id: string, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data);
  }
}
