import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Eingabefelder für das Login-Formular
  email = '';
  password = '';
  errorMessage = '';

  // Ausgewählte Rolle (admin oder user)
  role: 'admin' | 'user' | null = null;

  // Sichtbarkeit des Formulars
  formVisible = false;

  // Passwort sichtbar/versteckt
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // Methode zur Auswahl der Rolle und Anzeigen des Formulars
  selectRole(role: 'admin' | 'user') {
    this.role = role;
    this.formVisible = true;
  }

  // Weiterleitung zur Registrierungsseite
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Methode zum Einloggen des Benutzers
  login() {
    const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&f=y';

    // Anmeldung über den AuthService
    this.authService.login(this.email, this.password)
      .then((cred) => {
        const userEmail = cred.user.email;
  
        // Überprüfen, ob der Benutzer bereits existiert
        this.userService.getUsers().subscribe(users => {
          const matchedUser = users.find((u: User) => u.email === userEmail);
  
          if (matchedUser) {
            // Benutzer gefunden: Weiterleitung basierend auf der Rolle
            if (matchedUser.role === 'admin') {
              this.router.navigate(['/benutzer']);
            } else {
              this.router.navigate(['/dashboard']); 
            }
          } else {
            // Benutzer nicht gefunden: neuen Benutzer automatisch erstellen
            const newUser: Omit<User, 'id'> = {
              name: userEmail!.split('@')[0],
              avatar: defaultAvatar,
              beschreibung: 'Neues Mitglied',
              email: userEmail!,
              role: 'user'
            };
            
            // Neuen Benutzer speichern und zum Dashboard weiterleiten
            this.userService.addUser(newUser).subscribe(() => {
              this.router.navigate(['/dashboard']); 
            });
          }
        });
      })
      .catch((err) => {
        // Fehlerbehandlung bei der Anmeldung
        this.errorMessage = err.message;
      });
  }
}
