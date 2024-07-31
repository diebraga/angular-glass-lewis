import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get isFormValid(): boolean {
    return !!this.email && !!this.password;
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post<{
        token: string;
      }>(`${environment.apiUrl}/api/signin`, body, { headers })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/main']);
        },
        error: (error) => {
          if (error.status === 401) {
            alert('Invalid credentials!');
          } else {
            console.error('There was an error!', error);
          }
        },
      });
  }
}
