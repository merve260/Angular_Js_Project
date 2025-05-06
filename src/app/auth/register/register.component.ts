import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Eingabefelder
  email = '';
  password = '';
  confirmPassword = '';

  // Steuerungen für Passwortsichtbarkeit
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Nachrichten für Erfolg und Fehler
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Getter: Prüfen, ob Passwort und Bestätigung übereinstimmen
  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }

  // 🔥 Registrierung durchführen
  register() {
    // Fehlermeldungen und Erfolgsmeldungen zurücksetzen
    this.errorMessage = '';
    this.successMessage = '';

    // Überprüfen, ob Passwörter übereinstimmen
    if (this.passwordMismatch) {
      this.errorMessage = '❌ Passwörter stimmen nicht überein.';
      return;
    }

    // Authentifizierungs-Service aufrufen
    this.authService.register(this.email, this.password)
      .then(() => {
        // Erfolgsmeldung anzeigen
        this.successMessage = '✅ Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail.';
        
        // Felder leeren
        this.email = '';
        this.password = '';
        this.confirmPassword = '';

        // Optional: Nach erfolgreicher Registrierung zur Login-Seite weiterleiten
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500); // 2,5 Sekunden warten
      })
      .catch(error => {
        // Fehlermeldung anzeigen
        this.errorMessage = '❌ Registrierung fehlgeschlagen: ' + error.message;
      });
  }
}
