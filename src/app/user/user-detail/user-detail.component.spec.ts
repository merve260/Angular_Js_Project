import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.services';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);

    userServiceSpy.getUserById.and.returnValue(of({
      id: '1',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      beschreibung: 'Testbeschreibung',
      email: 'test@example.com',
      role: 'user'
    }));

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }) // <-- işte bu eksikti
          }
        },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Auth, useValue: {} },
        { provide: ToastService, useValue: { show: () => {} } },
        { provide: AuthService, useValue: { logout: () => Promise.resolve() } },
        { provide: Router, useValue: { navigateByUrl: () => Promise.resolve(true), navigate: () => Promise.resolve(true) } },
        { provide: SharedService, useValue: { notifyUserUpdated: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit çalışır
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
