import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MangeCategory } from '../../partials/dashboard/mange-category/mange-category';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Menu } from '../../partials/home/menu/menu';

@Component({
  selector: 'app-dashboard',
  imports: [MangeCategory,Menu],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  authService = inject(AuthService);
  userService = inject(UserService);

}
