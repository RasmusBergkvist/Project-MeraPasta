import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReservationComponent } from '../../partials/reservation/reservation';
import { About } from '../../partials/about/about';
import { Menu } from '../../partials/menu/menu';
import { OpeningHoursComponent } from '../../partials/opening-hours/opening-hours';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [Menu, ReservationComponent, OpeningHoursComponent, About, RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.scss',
})
export class Home {}
