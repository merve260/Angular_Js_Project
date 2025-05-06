import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { Route } from '@angular/router';
import { User } from '../models/user.model';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user: User = {
    id: '',
    name: '',
    avatar: '',
    beschreibung: '',
    email: '',
    role: 'user'
  };
  // Initialwerte für die Formulareingaben
  name = '';
  avatar = '';
  beschreibung = '';
  role: 'admin' | 'user' = 'user'; 
  email = '';
  newPassword = '';
  


  constructor(private userService: UserService, private router: Router,private toastService: ToastService) {}


  abbrechen() {
    this.router.navigate(['/benutzer']);
  }
  // Methode zum Hinzufügen eines neuen Benutzers
  addUser() {
    // E-Mail ve Passwort kontrolü
    if (!this.email.trim() || this.newPassword.trim().length < 6) {
      alert('E-Mail und Passwort sind erforderlich (Passwort min. 6 Zeichen).');
      return;
    }
  
    const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&f=y';
    const trimmedEmail = this.email.trim();
    const nameFromEmail = trimmedEmail.split('@')[0];
  
    // Eğer isim boşsa, mail'in '@' öncesi kısmı kullanılır
    const finalName = this.name.trim() || nameFromEmail;
  
    // 1. Kullanıcıyı veritabanına ekle
    this.userService.addUser({
      name: finalName,
      avatar: this.avatar.trim() || defaultAvatar,
      beschreibung: this.beschreibung.trim(),
      email: trimmedEmail,
      role: this.role
    }).subscribe(() => {
  
      // 2. Backend'e şifre gönderimi
      fetch('http://localhost:3000/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          newPassword: this.newPassword.trim()
        })
      })
        .then(() => {
          this.toastService.show('✅ Benutzer wurde erfolgreich hinzugefügt.');
          this.router.navigate(['/benutzer']);
        })
        .catch(err => {
          console.error('Fehler beim Passwort setzen:', err);
          this.toastService.show('⚠️ Benutzer gespeichert, aber Passwort konnte nicht gesetzt werden.');
        });
    });
  }
}
  
