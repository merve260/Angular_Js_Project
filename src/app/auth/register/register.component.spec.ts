import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [
        { provide: Auth, useValue: {} },         // ✅ sahte Auth
        { provide: AuthService, useValue: {} },  // ✅ sahte AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sollte das Komponent erstellen', () => {
    expect(component).toBeTruthy();
  });

  it('sollte passwordMismatch false sein, wenn Passwörter gleich sind', () => {
    component.password = 'Pa$$w0rd';
    component.confirmPassword = 'Pa$$w0rd';
    expect(component.passwordMismatch).toBeFalse();
  });

  it('sollte passwordMismatch true sein, wenn Passwörter unterschiedlich sind', () => {
    component.password = 'Pa$$w0rd';
    component.confirmPassword = 'falsch';
    expect(component.passwordMismatch).toBeTrue();
  });
});
