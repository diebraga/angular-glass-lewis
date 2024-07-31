import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  get isFormValid(): boolean {
    return !!this.email && !!this.password;
  }

  onSubmit() {
    const body = {
      email: this.email,
      password: this.password,
    };

    console.log(body);
  }
}
