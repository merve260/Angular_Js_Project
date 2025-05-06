import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.services';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  showPassword = false;


  editData = {
    name: '',
    avatar: '',
    beschreibung: '',
    email: '',
    password: ''
  };

  constructor(private route: ActivatedRoute, 
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
    private auth: Auth,
    private authService: AuthService,
    private sharedService: SharedService,
) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('Benutzer ID:', id);
      if (id) {
        this.user = null;
        this.isEditing = false;
        this.editData = {
          name: '',
          avatar: '',
          beschreibung: '',
          email: '',
          password: ''
        };
        this.userService.getUserById(id).subscribe((data) => {
          console.log('User Daten:', data); // kontrol
          this.user = data;
        });
      }
    });
  }

  bearbeiten() {
    if (!this.user) return;
    this.isEditing = true;
    this.editData = {
      name: this.user.name,
      avatar: this.user.avatar,
      beschreibung: this.user.beschreibung || '',
      email: '',
      password: ''
    };
  }

  speichern() {
    if (!this.user) return;
  
    const payload = {
      name: this.editData.name,
      avatar: this.editData.avatar,
      beschreibung: this.editData.beschreibung || '...'
    };
  
    // 1. Kullanıcı bilgilerini güncelle (MockAPI)
    this.userService.updateUser(this.user.id, payload).subscribe(updatedUser => {
      this.user = updatedUser;
  
      // 2. Eğer yeni e-mail veya şifre girildiyse backend'e gönder
      if (this.editData.email || this.editData.password) {
        fetch('http://localhost:3000/admin/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.editData.email || this.user!.email,
            newPassword: this.editData.password
          })
        })
        .then(() => {
          this.toastService.show('✅ Daten wurden aktualisiert.');
          this.sharedService.notifyUserUpdated();

          this.isEditing = false;
        })
        .catch(() => {
          this.toastService.show('X Fehler beim Aktualisieren der Zugangsdaten.');
        });
      } else {
        this.toastService.show('✅ Benutzerprofil gespeichert.');
        this.isEditing = false;
      }
    });
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  abbrechen() {
    this.isEditing = false;
  }
  


  loeschen() {
    if (!this.user) return;
  
    const confirmDelete = confirm(`Möchtest du ${this.user.name} wirklich löschen?`);
  
    if (confirmDelete) {
      this.userService.deleteUser(this.user.id).subscribe(() => {
  
        // 🔔 Toast bildirimi
        this.toastService.show(`☑ Benutzer "${this.user!.name}" wurde erfolgreich gelöscht.`);

  
        // Giriş yapan kişi mi?
        if (this.user!.email === this.auth.currentUser?.email) {
          this.authService.logout().then(() => {
            window.location.href = '/';
          });
        } else {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/benutzer']);
      });
    
    }
  });
  }
}
}
