import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { NgZone } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let ngZone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.name = '';
    component.surname = '';
    component.email = '';
    component.password = '';
    component.confirmPassword = '';

    component.onSubmit();

    httpMock.expectNone(`${environment.apiUrl}/api/signup`);
    expect(component.isFormValid).toBeFalse();
  });

  it('should submit if form is valid', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    spyOn(window, 'alert');
    spyOn(component.router, 'navigate');

    ngZone.run(() => {
      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/signup`);
      expect(req.request.method).toBe('POST');
      req.flush({}); // simulate a successful response

      expect(window.alert).toHaveBeenCalledWith('Registration successful');
      expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  it('should handle user already exists error', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    spyOn(window, 'alert');

    ngZone.run(() => {
      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/signup`);
      expect(req.request.method).toBe('POST');
      req.flush('User already exists!', {
        status: 409,
        statusText: 'Conflict',
      });

      expect(window.alert).toHaveBeenCalledWith('User already exists!');
    });
  });

  it('should handle server error', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    spyOn(window, 'alert');
    spyOn(console, 'error');

    ngZone.run(() => {
      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/signup`);
      expect(req.request.method).toBe('POST');
      req.flush('Server error', { status: 500, statusText: 'Server Error' });

      expect(window.alert).not.toHaveBeenCalledWith('User already exists!');
      expect(console.error).toHaveBeenCalledWith(
        'There was an error!',
        jasmine.any(Object)
      );
    });
  });

  it('should show validation error if passwords do not match', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'differentPassword';

    spyOn(window, 'alert');

    ngZone.run(() => {
      component.onSubmit();

      httpMock.expectNone(`${environment.apiUrl}/api/signup`);

      expect(window.alert).not.toHaveBeenCalled();
      expect(component.isFormValid).toBeFalse();
      expect(component.passwordsMatch).toBeFalse();
    });
  });
});
