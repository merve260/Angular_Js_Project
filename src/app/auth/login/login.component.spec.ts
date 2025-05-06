import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'addUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Auth, useValue: {} }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  
 
    userServiceSpy.getUsers.and.returnValue(of([]));
    userServiceSpy.addUser.and.returnValue(of({
      id: '123',
      name: 'Max Mustermann',
      avatar: 'https://www.example.com/avatar.jpg',
      beschreibung: 'Neues Mitglied',
      email: 'test@example.com',
      role: 'user'
    }));
  
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login when login() is triggered', () => {
    component.email = 'test@example.com';
    component.password = 'Pa$$w0rd';

    const mockCredential = {
      user: { email: 'test@example.com' },
      providerId: 'password',
      operationType: 'signIn'
    } as unknown as UserCredential;

    authServiceSpy.login.and.returnValue(Promise.resolve(mockCredential));

    userServiceSpy.getUsers.and.returnValue(of([]));

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'Pa$$w0rd');
  });
});
