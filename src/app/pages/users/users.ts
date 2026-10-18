import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { LoadingDashboard } from '../../partials/dashboard/loading-dashboard/loading-dashboard';

@Component({
  imports: [ReactiveFormsModule, LoadingDashboard],
  selector: 'app-users',
  styleUrl: './users.scss',
  templateUrl: './users.html',
})
export class Users {
  //Signal: meddelande vid skapa eller radera användare. 
  errorCreate = signal<string>("");
  successCreate = signal<string>("");
  errorDelete = signal<string>("");
  successDelete = signal<string>("");

  //Signal till laddningsanimation
  isLoading = signal<boolean>(false);

  //Hämtar service och router
  userService = inject(UserService);

  //Validering
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', [Validators.required])
  });

  async onSubmit() {
    //Om inte login-fält är korrekt ifyllt.
    if (this.registerForm.invalid) {
      return;
    }


    try {
      //Rensar tidigare meddelanden
      this.successCreate.set("");
      this.errorDelete.set("");

      //Hämtar värden från login-formulär enligt interface
      const registerInput = this.registerForm.value as User;

      //Skickar inloggningsuppgifter
      await this.userService.registerUser(registerInput);

      //Återställer formuläret
      this.registerForm.reset();

      //Meddelande vid skapad användare.
      this.successCreate.set(`Användare skapad för ${registerInput.username}`)

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successCreate.set("")
      }, 5000);

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.errorCreate.set("Din inloggningsession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else if (error.status === 409) {
        //Om användaren redan finns.
        this.errorCreate.set("Användaren finns redan!");
      } else {
        this.errorCreate.set("Det gick inte att skapa användaren. Försök igen senare.")
      }

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorCreate.set("")
      }, 5000);


    }
  }

  //vid start
  async ngOnInit() {
    try {
      //Visar laddningsanimation
      this.isLoading.set(true);

      //Hämtar användare
      await this.userService.loadUsers();
    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.errorCreate.set("Din inloggningssession har passerat. Vänligen logga in på nytt.");
      } else {
        this.errorCreate.set("Det går inte att hämta användare för tillfället.");
      }
    } finally {
      //Döljer laddningsanimation
      this.isLoading.set(false);
    }


  }

  //Radera användare
  async onDelete(userId: number, username: string): Promise<void> {
    try {
      await this.userService.deleteUser(userId);

      //Meddelande vid radering
      this.successDelete.set(`Användaren har raderats: ${username}`);

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.successDelete.set("")
      }, 5000);

    } catch (error: any) {
      //Om användaren redan finns.
      if (error.status === 400) {
        this.errorDelete.set("Det måste finnas minst en administratör!");
      } else {
        this.errorDelete.set("Det gick inte att radera användaren Försök igen senare.")
      }

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.errorDelete.set("")
      }, 5000);


    }
  }
}
