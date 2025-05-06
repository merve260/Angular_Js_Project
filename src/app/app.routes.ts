import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component'; 
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'register', component: RegisterComponent }, 

  {
    path: 'benutzer',
    component: UserComponent,
    canActivate: [authGuard],
    children: [
      { path: ':id', component: UserDetailComponent },
    ]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'benutzer',
    component: UserComponent,
    children: [
      {
        path: ':id',
        component: UserDetailComponent
      }
    ]
  },
  
  {
    path: 'neu',
    component: AddUserComponent,
    canActivate: [authGuard],
  },


  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
