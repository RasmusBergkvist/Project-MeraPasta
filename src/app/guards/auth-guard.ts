import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //Hämtar service och router
  const authService = inject(AuthService);
  const router = inject(Router);
  
  //Kontroll om användaren är inloggad.
  if(authService.isLoggedIn()) {

      return true;

  }
     router.navigate(["/login"])
  return false;
};
