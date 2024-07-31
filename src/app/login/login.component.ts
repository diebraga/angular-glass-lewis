import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  get isFormValid(): boolean {
    return !!this.email && !!this.password;
  }

  onSubmit() {
    const body = {
      email: this.email,
      password: this.password,
    };

    console.log(body);
    this.router.navigate(['/main']);
  }
}
