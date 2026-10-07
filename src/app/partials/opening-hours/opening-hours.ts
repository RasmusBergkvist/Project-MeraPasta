import { Component, inject, signal } from '@angular/core';
import { OpeningHoursService } from '../../services/openinghours.service';


@Component({
  imports: [],
  selector: 'app-opening-hours',
  styleUrl: './opening-hours.scss',
  templateUrl: './opening-hours.html',
})
export class OpeningHoursComponent {
  //Signal felmeddelande
  error = signal<string | null>(null);

  //Hämtar service
  openingHoursService = inject(OpeningHoursService);


  //Vid start
  async ngOnInit() {
    try {
      await this.openingHoursService.loadOpeningHours();
    } catch (error) {
      this.error.set("Det gick inget att hämta öppettiderna för tillfället.")
    }

  }
}
