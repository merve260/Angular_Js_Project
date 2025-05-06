import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, updateEmail, updatePassword, User as FirebaseUser } from '@angular/fire/auth';
import { UserCredential } from 'firebase/auth';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggingOut = false;

  constructor(private auth: Auth, private toastService: ToastService) {}

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(cred => {
        sendEmailVerification(cred.user);
        return cred;
      });
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  

  logout(): Promise<void> {
    this.isLoggingOut = true;
    return signOut(this.auth)
      .then(() => {
        this.toastService.show('✅ Erfolgreich abgemeldet!');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      })
      .catch((error) => {
        console.error('Fehler beim Abmelden:', error);
        this.isLoggingOut = false;
      });
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  updateEmail(user: FirebaseUser, newEmail: string): Promise<void> {
    return updateEmail(user, newEmail);
  }

  

  updatePassword(user: FirebaseUser, newPassword: string): Promise<void> {
    return updatePassword(user, newPassword);
  }
}
