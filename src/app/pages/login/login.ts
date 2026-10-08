import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginUser } from '../../models/login.user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class Login {
  //Signal felmeddelande
  error = signal<string>("");


  //Hämtar service och router
  authService = inject(AuthService);
  router = inject(Router);


  //Validering
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })


  async onSubmit() {
    //Om inte login-fält är korrekt ifyllt.
    if (this.loginForm.invalid) {
      return;
    }


    try {
      //Rensar tidigare fel
      this.error.set("");

      //Hämtar värden från login-formulär enligt interface
      const loginInput = this.loginForm.value as LoginUser;

      //Skickar inloggningsuppgifter
      await this.authService.login(loginInput);

      //Vid lyckad inloggning skickas användaren till dashboard
      this.router.navigate(["/dashboard"]);

    } catch(error) {
      console.error(error);
      this.error.set("Felaktig e-post eller lösenord!")
    }
}


}
