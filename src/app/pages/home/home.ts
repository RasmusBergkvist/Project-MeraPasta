import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReservationComponent } from '../../partials/home/reservation/reservation';
import { About } from '../../partials/home/about/about';
import { OpeningHoursComponent } from '../../partials/home/opening-hours/opening-hours';
import { RouterLink } from '@angular/router';
import { Menu } from '../../partials/home/menu/menu';


@Component({
  selector: 'app-home',
  imports: [Menu, ReservationComponent, OpeningHoursComponent, About, RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.scss',
})
export class Home {}
