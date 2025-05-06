import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { ToastService } from '../services/toast.service';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = null;
  userName: string = '';
  userRole: string = '';
  avatarUrl: string = '';
  isAdmin: boolean = false;

  events: (Event & { editing?: boolean })[] = [];
  newEventText: string = '';
  newEventDesc: string = '';
  newEventDate: string = '';
  isPublicEvent: boolean = false;

  editText: string = '';
  editDesc: string = '';
  editDate: string = '';

  newName: string = '';
  newAvatar: string = '';
  newEmail: string = '';
  newPassword: string = '';
  currentPassword: string = '';
  profileSuccess: string = '';
  profileError: string = '';
  showProfileForm: boolean = false;
  showPassword: boolean = false;
  showOnlyFavorites: boolean = false;
  showOnlyStarred: boolean = false;
  newEventRoom: string = '';
  newEventLimit: number | null = null;
  editLimit: number | null = null; 
  editRoom: string = '';
  raumListe: string[] = [
    'Besprechungsraum 1',
    'Besprechungsraum 2',
    'Konferenzraum',
    'Teamraum',
    'Workshopraum'
  ];




  constructor(
    private auth: Auth,
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private eventService: EventService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    
    if (user) {
      this.userEmail = user.email;
      this.userName = user.email?.split('@')[0] || '';

      this.userService.getUsers().subscribe(users => {
        const found = users.find(u => u.email === this.userEmail);
        if (found) {
          this.userName = found.name;
          this.avatarUrl = found.avatar;
          this.userRole = found.role;
          this.isAdmin = found.role === 'admin';
          this.toastService.show(`Willkommen, ${this.isAdmin ? 'Admin' : 'User'} ${this.userName} 👋`);
        }
      });

      this.eventService.getAllEvents().subscribe(events => {
        this.events = events
          .filter(event => event.userEmail === user.email || event.isPublic)
          .map(e => ({ ...e, editing: false, favorite: e.favorite || false }));
      });
    }
  }

  addEvent() {
    if (!this.userEmail || !this.newEventText.trim() || !this.newEventDate.trim()) return;

    const neueZeit = new Date(this.newEventDate).getTime();

    const newEvent: Omit<Event, 'id'> = {
      userEmail: this.userEmail,
      title: this.newEventText,
      description: this.newEventDesc || '',
      date: this.newEventDate,
      completed: false,
      isPublic: this.isPublicEvent,
      createdBy: this.userName,
      participants: [],
      favorite: false,
      raum: this.newEventRoom || '',
      limit: this.newEventLimit || undefined
    };

    if (this.isPublicEvent && this.newEventRoom) {
      const konflikt = this.events.find(e =>
        e.raum === this.newEventRoom &&
        Math.abs(new Date(e.date).getTime() - neueZeit) < 30 * 60 * 1000 // 30 dakika
      );
      if (konflikt) {
        const bisZeit = new Date(new Date(konflikt.date).getTime() + 30 * 60 * 1000)
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          this.toastService.show(`⚠️ Dieser Raum ist bis ${bisZeit} besetzt.`);

        return;
      }
    }

    

    this.eventService.addEvent(newEvent).subscribe((addedEvent) => {
      this.events.push({ ...addedEvent, editing: false });
      this.newEventText = '';
      this.newEventDesc = '';
      this.newEventDate = '';
      this.isPublicEvent = false;
      this.newEventRoom = '';
    });
  }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id).subscribe(() => {
      this.events = this.events.filter(event => event.id !== id);
    });
  }





  toggleCompleted(event: Event & { editing?: boolean }) {
    const updated = { ...event, completed: !event.completed };
    this.eventService.updateEvent(event.id, updated).subscribe(() => {
      event.completed = !event.completed;
    });
  }

  editEvent(event: Event & { editing?: boolean }) {
    event.editing = true;
    this.editText = event.title;
    this.editDesc = event.description;
    this.editDate = event.date;
  }

  saveEvent(event: Event & { editing?: boolean }) {
    
    const neueZeit = new Date(this.editDate).getTime();
    if (event.isPublic && this.editRoom) {
      const konflikt = this.events.find(e =>
        e.id !== event.id && 
        e.raum === this.editRoom &&
        Math.abs(new Date(e.date).getTime() - neueZeit) < 30 * 60 * 1000 // 30 dakika
      );
  
      if (konflikt) {
        const bisZeit = new Date(new Date(konflikt.date).getTime() + 30 * 60 * 1000)
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.toastService.show(`⚠️ Dieser Raum ist bis ${bisZeit} besetzt.`);
        return;
      }
    }
    const updated: Event = {
      ...event,
      title: this.editText,
      description: this.editDesc,
      date: this.editDate,
      raum: this.editRoom,
      limit: this.editLimit || undefined,
      completed: event.completed,
      isPublic: event.isPublic,
      createdBy: event.createdBy,
      participants: event.participants || [],
      favorite: event.favorite || false
    };
    this.eventService.updateEvent(event.id, updated).subscribe((res) => {
      event.title = res.title;
      event.description = res.description;
      event.date = res.date;
      event.raum = res.raum;
      event.editing = false;
    });
  }
  

  cancelEdit(event: Event & { editing?: boolean }) {
    event.editing = false;
  }

  toggleFavorite(event: Event & { editing?: boolean }) {
    const updated = { ...event, favorite: !event.favorite };
  
    this.eventService.updateEvent(event.id, updated).subscribe(() => {
      event.favorite = updated.favorite;
    });
  }
  

  sortedEvents() {
    return this.events.slice().sort((a, b) => {
      if (a.favorite === b.favorite) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return b.favorite ? 1 : -1;
    });
  }

  joinEvent(event: Event & { editing?: boolean }) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userName = this.userName;

    if (!event.participants) {
      event.participants = [];
    }

    // Teilnehmerzahl kontrollieren
  if (event.limit && event.participants.length >= event.limit) {
    this.toastService.show('⚠️ Für dieses Event gibt es leider keinen freien Platz mehr.');
    return;
  }

  if (!event.participants.includes(userName)) {
    event.participants.push(userName);
    this.eventService.updateEvent(event.id, event).subscribe(() => {
      console.log('Benutzer hat erfolgreich teilgenommen:', userName);
    });
  }
}

  leaveEvent(event: Event & { editing?: boolean }) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userName = this.userName;

    if (event.participants?.includes(userName)) {
      event.participants = event.participants.filter(name => name !== userName);
      this.eventService.updateEvent(event.id, event).subscribe(() => {
        console.log('Teilnahme zurückgezogen:', userName);
      });
    }
  }

  removeParticipant(event: Event & { editing?: boolean }, participant: string) {
    if (event.participants?.includes(participant)) {
      event.participants = event.participants.filter(name => name !== participant);
      this.eventService.updateEvent(event.id, event).subscribe(() => {
        console.log('Teilnehmer gelöscht:', participant);
      });
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.toastService.show('Erfolgreich abgemeldet! ✅');
      this.router.navigate(['/']);
    });
  }

  myEvents() {
    let list = this.events.filter(event =>
      event.userEmail === this.userEmail || event.participants?.includes(this.userName)
    );
  
    // Zeigt nur Favoriten
    if (this.showOnlyStarred) {
      list = list.filter(event => event.favorite);
    }
  
    // Favoriten kommt vor
    return list.sort((a, b) => {
      if (a.favorite === b.favorite) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return b.favorite ? 1 : -1;
    });
  }
  

  publicEvents() {
    return this.events.filter(event => 
      event.isPublic && !event.participants?.includes(this.userName)
    );
  }

  updateProfile() {
    if (!this.userEmail) return;

    this.profileError = '';
    this.profileSuccess = '';

    

    this.userService.getUsers().subscribe(users => {
      const currentUser = users.find(u => u.email === this.userEmail);
      if (!currentUser) {
        this.profileError = 'Benutzer wurde nicht gefunden.';
        return;
      }

      const updateData: Partial<User> = {};

      if (this.newName.trim().length >= 5) {
        updateData.name = this.newName;
      }

      if (this.newAvatar.trim()) {
        updateData.avatar = this.newAvatar;
      }

      if (Object.keys(updateData).length > 0) {
        this.userService.updateUser(currentUser.id, updateData).subscribe(() => {
          if (updateData.name) this.userName = updateData.name;
          if (updateData.avatar) this.avatarUrl = updateData.avatar;
          this.profileSuccess = 'Profilinformationen erfolgreich aktualisiert.';
        });
      }

      if (this.newEmail.trim()) {
        this.authService.updateEmail(this.auth.currentUser!, this.newEmail)
          .then(() => {
            this.profileSuccess += ' E-Mail erfolgreich aktualisiert.';
          })
          .catch(err => {
            this.profileError = 'Fehler beim Aktualisieren der E-Mail: ' + err.message;
          });
      }
      if (updateData.name && currentUser.name && updateData.name !== currentUser.name) {
        this.events.forEach(event => {
          const index = event.participants?.indexOf(currentUser.name);
          if (index !== undefined && index > -1) {
            event.participants[index] = updateData.name!;
            this.eventService.updateEvent(event.id, event).subscribe();
          }
        });
      }

      if (this.newPassword.trim().length >= 6 && this.currentPassword.trim()) {
        const user = this.auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user!.email!,
          this.currentPassword
        );
      
        reauthenticateWithCredential(user!, credential)
          .then(() => {
            return this.authService.updatePassword(user!, this.newPassword);
          })
          .then(() => {
            this.profileSuccess += ' Passwort erfolgreich aktualisiert.';
          })
          .catch(err => {
            if (err.code === 'auth/wrong-password') {
              this.profileError = '❌ Das aktuelle Passwort ist falsch.';
            } else if (err.code === 'auth/too-many-requests') {
              this.profileError = '⚠️ Zu viele Versuche. Bitte warte etwas.';
            } else {
              this.profileError = 'Fehler beim Passwort-Update: ' + err.message;
            }
          });
      }
      
    });
  }
  
}
