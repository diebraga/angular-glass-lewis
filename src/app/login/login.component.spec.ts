import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { environment } from '../../environments/environment.prod';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if form is invalid', () => {
    component.email = '';
    component.password = '';
    expect(component.isFormValid).toBe(false);

    component.email = 'test@example.com';
    component.password = '';
    expect(component.isFormValid).toBe(false);

    component.email = '';
    component.password = 'password';
    expect(component.isFormValid).toBe(false);
  });

  it('should return true if form is valid', () => {
    component.email = 'test@example.com';
    component.password = 'password';
    expect(component.isFormValid).toBe(true);
  });

  it('should store token and navigate to main on successful login', () => {
    component.email = 'test@example.com';
    component.password = 'password';

    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/signin`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'fake-token' });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should alert invalid credentials on 401 error', () => {
    component.email = 'test@example.com';
    component.password = 'password';

    spyOn(window, 'alert');

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/signin`);
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials!');
  });

  it('should log error on other errors', () => {
    component.email = 'test@example.com';
    component.password = 'password';

    spyOn(console, 'error');

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/signin`);
    expect(req.request.method).toBe('POST');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith(
      'There was an error!',
      jasmine.any(Object)
    );
  });
});
