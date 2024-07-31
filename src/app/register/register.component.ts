import { Component } from '@angular/core';

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
  isAdmin: boolean = false;

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

    const registerData = {
      email: this.email,
      password: this.password,
      name: this.name,
      surname: this.surname,
      isAdmin: this.isAdmin,
    };

    console.log(registerData);
  }
}
