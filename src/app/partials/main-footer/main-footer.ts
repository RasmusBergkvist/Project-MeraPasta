import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-footer',
  imports: [RouterLink],
  templateUrl: './main-footer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-footer.scss',
})
export class MainFooter {
  //Hämtar service
  authService = inject(AuthService);


  //Vid utloggning
  onLogout() {
    this.authService.logout();
  }

  
}
