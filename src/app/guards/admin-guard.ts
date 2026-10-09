import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    //Hämtar service och router
  const authService = inject(AuthService);
  const router = inject(Router);
  
  //Kontroll om användaren är inloggad.
  if(authService.isAdmin()) {

      return true;

  }
     router.navigate(["/dashboard"])
  return false;
};

