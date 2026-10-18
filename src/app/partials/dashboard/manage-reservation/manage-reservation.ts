import { Component, inject, signal } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reservation } from '../../../models/reservation.interface';
import { LoadingDashboard } from '../loading-dashboard/loading-dashboard';

@Component({
  imports: [ReactiveFormsModule, LoadingDashboard],
  selector: 'app-manage-reservation',
  styleUrl: './manage-reservation.scss',
  templateUrl: './manage-reservation.html',
})
export class ManageReservation {
  //Signal: Meddelande
  success = signal<string>("");
  error = signal<string>("");

  //Signal till laddningsanimation
  isLoading = signal<boolean>(false);

  //Signal redigering
  editId = signal<number | null>(null);


  //Hämtar service
  reserverationService = inject(ReservationService);


  //Validering 
  editReservationForm = new FormGroup({
    customer_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    customer_email: new FormControl('', [Validators.required, Validators.email]),
    customer_phonenumber: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]),
    reservation_date: new FormControl('', [Validators.required]),
    reservation_time: new FormControl('', [Validators.required]),
    guests: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
    message: new FormControl('')
  });


  //Hämta data till redigering
  getDataToEdit(res: Reservation) {
    //Om Id inte finns
    if (!res.reservation_id) {
      return;
    }
    //Uppdaterar signal med id
    this.editId.set(res.reservation_id);

    //Hämtar datan till formulärfält
    this.editReservationForm.setValue({
      customer_name: res.customer_name,
      customer_email: res.customer_email,
      customer_phonenumber: res.customer_phonenumber,
      reservation_date: this.convertBackDate(res.original_date),
      reservation_time: res.reservation_time,
      guests: res.guests,
      message: res.message || ""
    });

  }

  //Skicka bokningsförfrågan
  async onSubmit() {
    //Rensar tidigare meddelanden
    this.success.set("");
    this.error.set("");

    //Om formuläret inte är korrekt ifyllt. 
    if (this.editReservationForm.invalid) {
      return;
    }

    //Hämtar Id vid redigering
    const currentId = this.editId();

    //Om Id inte finns
    if (!currentId) {
      this.error.set("Det gick inte att hitta bokningen.")
      return;
    }

    //Hämtar värde för bokningsförfrågan enligt interfacet
    const reservationInput = this.editReservationForm.value as Reservation;

    try {
      //Skickar bokningsförfrågan
      await this.reserverationService.updateReservation(currentId, reservationInput);

      //Meddelande vid lyckad bokning.
      this.success.set("Bokningen är uppdaterad.")

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.success.set("")
      }, 5000);

      //Rensar formuläret och editId
      this.editReservationForm.reset();
      this.editId.set(null);

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningsession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else {
        this.error.set("Något gick fel vid ändringen. Försök igen senare.")
      }
    }

  }


  //vid start
  async ngOnInit() {
    try {
      //Visar laddningsanimation
      this.isLoading.set(true);

      //Hämtar bokningsförfrågningar
      await this.reserverationService.loadReservations();

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningsession har passerat. Vänligen logga in på nytt.");
      } else {
        this.error.set("Det går inte att hämta bokningsförfrågningarna för tillfället.");
      }
    } finally {
      //Döljer laddningsanimation
      this.isLoading.set(false);
    }
  }
  //Radera menyartikel
  async onDelete(reservationId: number, customerName: string): Promise<void> {
    try {

      //Rensar tidigare meddelanden
      this.success.set("");
      this.error.set("");


      await this.reserverationService.deleteMenuItem(reservationId);

      //Meddelande vid radering
      this.success.set(`Bokningen för ${customerName} har tagits bort. `);

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.success.set("")
      }, 5000);

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningssession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else {
        this.error.set("Det gick inte att radera menyartikeln. Försök igen senare.")
      }


      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.error.set("")
      }, 5000);


    }
  }


  //Konvertera tillbaka datum vid redigering
  convertBackDate(dateToCovert: string | null | undefined) {
    if (!dateToCovert) {
      return ""
    }
    const date = new Date(dateToCovert);
    return date.toLocaleDateString("sv-SE", { year: 'numeric', month: "2-digit", day: "2-digit", })

  }

}
