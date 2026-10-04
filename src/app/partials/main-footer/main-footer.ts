import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-footer',
  imports: [RouterLink],
  templateUrl: './main-footer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-footer.scss',
})
export class MainFooter {}
