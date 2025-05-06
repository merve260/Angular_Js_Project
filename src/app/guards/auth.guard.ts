import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const authService = inject(AuthService); 

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      console.log("Guard ausgelöst. Benutzer:", user);

      if (user) {
        resolve(true);
      } else {
        if (!authService.isLoggingOut) { 
          toastService.show('❗ Sie müssen sich anmelden!');
        }
        router.navigate(['/']);
        authService.isLoggingOut = false; 
        resolve(false);
      }
    });
  });
};

