import { Component, inject, signal } from '@angular/core';
import { OpeningHoursService } from '../../../services/openinghours.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpeningHours } from '../../../models/openinghours.interface';
import { LoadingDashboard } from '../loading-dashboard/loading-dashboard';

@Component({
  imports: [ReactiveFormsModule, LoadingDashboard],
  selector: 'app-manage-opening-hours',
  styleUrl: './manage-opening-hours.scss',
  templateUrl: './manage-opening-hours.html',
})
export class ManageOpeningHours {

  //Signals: Meddelanden
  success = signal<string>("");
  error = signal<string>("");

  //Signal till laddningsanimation
  isLoading = signal<boolean>(false);

  //Signal: redigering
  editId = signal<number | null>(null);

  //Hämtar service
  openingHoursService = inject(OpeningHoursService)


  //Validering
  hourForm = new FormGroup({
    day_of_week: new FormControl('', [Validators.required, Validators.minLength(6)]),
    open_time: new FormControl(''),
    close_time: new FormControl('')
  });


  //Hämta data till redigering
  getDataToEdit(hour: OpeningHours) {
    //Om Id inte finns
    if (!hour.open_id) {
      return;
    }
    //Uppdaterar signal med id
    this.editId.set(hour.open_id);

    //Hämtar datan till formulärfält
    this.hourForm.setValue({
      day_of_week: hour.day_of_week,
      open_time: hour.open_time || "",
      close_time: hour.close_time || ""
    });

  }

  //Skapa eller uppdatera öppettider
  async onSubmit() {
    //Rensar tidigare meddelanden
    this.success.set("");
    this.error.set("");

    //Om formuläret inte är korrekt ifyllt. 
    if (this.hourForm.invalid) {
      return;
    }

    //Hämtar Id vid redigering
    const currentId = this.editId();

    //Hämtar värde för öppettiderna enligt interfacet
    const openingHoursInput = this.hourForm.value as OpeningHours;


    try {

      if (currentId) {
        //Uppdaterar öppetiderna
        await this.openingHoursService.updateOpeningHours(currentId, openingHoursInput);
        //Meddelande vid uppdaterad öppettid.
        this.success.set(`Öppettiden har uppdaterats för: ${openingHoursInput.day_of_week}`);
        //Sätter signal till null.
        this.editId.set(null);
      } else {

        //Lägger till öppettid
        await this.openingHoursService.createOpeningHour(openingHoursInput);

        //Meddelande när öppettid lagt till.
        this.success.set(`Öppettid har lagts till för: ${openingHoursInput.day_of_week}`)
      }

      //Återställer formuläret
      this.hourForm.reset();

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.success.set("")
      }, 5000);

    } catch (error: any) {

      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningssession har passerat. Vänligen logga in på nytt för att utföra åtgärden!");
      } else if (error.status === 409) {
        //Om menyartikel redan finns.
        this.error.set("Öppettiden finns redan!");
      } else {
        this.error.set("Det gick inte att spara öppettiden. Försök igen senare.")
      }
    }
  }



  //Vid start
  async ngOnInit() {
    try {
      //Visar laddningsanimation
      this.isLoading.set(true);

      //Hämtar öppettider
      await this.openingHoursService.loadOpeningHours();
    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningssession har passerat. Vänligen logga in på nytt.");
      } else {
        this.error.set("Det går inte att hämta öppetiderna för tillfället.");
      }
    } finally {
      //Döljer laddningsanimation
      this.isLoading.set(false);
    }
  }


  //Radera menyartikel
  async onDelete(openId: number, day_of_week: string): Promise<void> {
    try {

      //Rensar tidigare meddelanden
      this.success.set("");
      this.error.set("");


      await this.openingHoursService.deleteOpeningHour(openId);

      //Meddelande vid radering
      this.success.set(`Öppetiden har raderats: ${day_of_week}.`);

      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.success.set("")
      }, 5000);

    } catch (error: any) {
      if (error.status === 403) {
        //Om tokens giltigthetstid har passerat.
        this.error.set("Din inloggningssession har passerat. Vänligen logga in på nytt.");
      } else {
        this.error.set("Det går inte att hämta öppetiderna för tillfället.");
      }


      //Meddelandent nollställs efter 5 sekunder.
      setTimeout(() => {
        this.error.set("")
      }, 5000);


    }
  }
}
