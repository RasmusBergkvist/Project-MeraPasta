import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MangeCategory } from '../../partials/dashboard/mange-category/mange-category';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Menu } from '../../partials/home/menu/menu';
import { ManageReservation } from '../../partials/dashboard/manage-reservation/manage-reservation';
import { ManageOpeningHours } from '../../partials/dashboard/manage-opening-hours/manage-opening-hours';

@Component({
  selector: 'app-dashboard',
  imports: [MangeCategory, Menu, ManageReservation, ManageOpeningHours],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  //Hämtar service
  authService = inject(AuthService);
  userService = inject(UserService);

}
