import { Component, inject, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reservation } from '../../models/reservation.interface';
import { firstValueFrom } from 'rxjs';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reservation',
  styleUrl: './reservation.scss',
  templateUrl: './reservation.html',
})
export class ReservationComponent {

  //Signals: meddelande vid bokningförfrågan
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  //Läser in service
  reservationService = inject(ReservationService);

  //Validering 
  reservationForm = new FormGroup({
    customer_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    customer_email: new FormControl('', [Validators.required, Validators.email]),
    customer_phonenumber: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]),
    reservation_date: new FormControl('', [Validators.required]),
    reservation_time: new FormControl('', [Validators.required]),
    guests: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
    message: new FormControl('')
  });

  //Skicka bokningsförfrågan
  async onSubmit() {
    //Rensar tidigare meddelanden
    this.success.set(null);
    this.error.set(null);

    //Om formuläret inte är korrekt ifyllt. 
    if (this.reservationForm.invalid) {
      return;
    }

    //Hämtar värde för bokningsförfrågan enligt interfacet
    const reservationInput = this.reservationForm.value as Reservation;

    try {
      //Skickar bokningsförfrågan
      await firstValueFrom(this.reservationService.createReservation(reservationInput));

      //Meddelande vid lyckad bokning.
      this.success.set("Din bokningsförfrågan är skickad. Vi återkommer till dig med en bekräftelse på din bokning.")

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.success.set(null)
      }, 5000);

      //Rensar formuläret
      this.reservationForm.reset();
    } catch (error) {
      //Vid fel
      this.error.set("Något gick fel vid bokningsförfrågan. Försök igen senare.")

    }

  }
}



