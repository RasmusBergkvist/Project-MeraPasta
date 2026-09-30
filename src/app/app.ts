import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from './partials/main-header/main-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainHeader],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Project-MeraPasta');
}
