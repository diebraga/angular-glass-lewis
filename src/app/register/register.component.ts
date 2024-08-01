import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get isFormValid(): boolean {
    return (
      !!this.name &&
      !!this.surname &&
      !!this.email &&
      !!this.password &&
      !!this.confirmPassword &&
      this.passwordsMatch
    );
  }

  onSubmit() {
    if (!this.isFormValid) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const registerData = {
      email: this.email,
      password: this.password,
      name: this.name,
      surname: this.surname,
    };

    this.http
      .post(`${environment.apiUrl}/api/signup`, registerData, { headers })
      .subscribe({
        next: (response) => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 409) {
            alert('User already exists!');
          } else {
            console.error('There was an error!', error);
          }
        },
      });
  }
}
