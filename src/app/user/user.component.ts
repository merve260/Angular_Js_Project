import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.services';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  nameFilter = '';
  idFilter = '';
  selectedId = '';

  showDetail = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  
    this.sharedService.userUpdated$.subscribe(() => {
      this.userService.getUsers().subscribe(data => {
        this.users = data;
      });
    });
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  

  filteredUsers(): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
      user.id.toLowerCase().includes(this.idFilter.toLowerCase())
    );
  }
  navigateToUser(id: string) {
    this.selectedId = id;
    this.router.navigate(['/benutzer', id]);
  }
}
