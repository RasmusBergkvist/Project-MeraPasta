import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { single } from 'rxjs';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink],
  templateUrl: './main-header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-header.scss',
})
export class MainHeader {

  //Signal för kontrollera om menyn är öppen eller stängd.
  isMenuOpen = signal<boolean>(false);


  //Hämtar service 
  authService = inject(AuthService);

  //Togglar menyns värde mellan true och false
  toggleMenu(){
    this.isMenuOpen.update(value => !value);
  }

  //Stänger menyn
  closeMenu(){
    this.isMenuOpen.set(false);
  }
}
