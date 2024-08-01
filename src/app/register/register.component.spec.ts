import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
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

    // No HTTP request should be made
    httpMock.expectNone(`${environment.apiUrl}/api/signup`);
  });

  it('should submit if form is valid', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    spyOn(window, 'alert').and.callThrough();
    spyOn(component.router, 'navigate').and.callThrough();

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/signup`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // simulate a successful response

    expect(window.alert).toHaveBeenCalledWith('Registration successful');
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle user already exists error', () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    spyOn(window, 'alert').and.callThrough();

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/signup`);
    expect(req.request.method).toBe('POST');
    req.flush('User already exists!', { status: 409, statusText: 'Conflict' });

    expect(window.alert).toHaveBeenCalledWith('User already exists!');
  });
});
