import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink],
  templateUrl: './main-header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-header.scss',
})
export class MainHeader {}
