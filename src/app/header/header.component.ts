import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAdmin = false;
  showHeader = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user?.email) {
        this.userService.getUsers().subscribe((users: User[]) => {
          const current = users.find(u => u.email === user.email);
          this.isAdmin = current?.role === 'admin';
        });
      }
    });

    this.router.events.subscribe(() => {
      this.updateHeaderVisibility();
    });
  }

  updateHeaderVisibility() {
    this.showHeader = this.router.url.includes('/benutzer');
  }

  logout() {
    this.authService.logout();
  }
}
