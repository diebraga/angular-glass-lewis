import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = JSON.stringify({
      email: this.email,
      password: this.password,
    });

    this.http
      .post(
        'https://glass-lewis-api-git-main-diebragas-projects.vercel.app/api/signin',
        body,
        { headers }
      )
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error('There was an error!', error),
      });
  }
}
