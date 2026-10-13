import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Reservation } from '../models/reservation.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Service()
export class ReservationService {
    private url = "http://localhost:3000/api/reservations";

    http = inject(HttpClient);

    //Hämtar service 
    authService = inject(AuthService);

    //Signal
    reservation = signal<Reservation[]>([]);

    //Hämta bokningsförfrågan
    async getReservation(): Promise<Reservation[]> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const reservation = this.http.get<Reservation[]>(this.url, { headers: headers });
        return await firstValueFrom(reservation);
    }

    //Ladda bokningsförfrågningar. 
    async loadReservations() {
        const response = await this.getReservation();

        //Mappar response och formterar datum och tid
        const formatResponse = response.map(res => ({
            //Skapa en kopia av res med dess properties
            ...res,
            //Formaterar datum- och tid
            original_date: res.reservation_date,
            reservation_date: this.formatDate(res.reservation_date),
            reservation_time: this.formatTime(res.reservation_time)

        }));

        //Uppdaterar signal med formaterad data.
        this.reservation.set(formatResponse);

    }

    //Skapa bokningsförfrågan
    createReservation(reservation: Reservation) {
        return this.http.post<Reservation>(this.url, reservation);
    }

    //Uppdatera bokningsförfrågningar
    async updateReservation(reservationId: number, reservation: Reservation): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const update = this.http.put<void>(`${this.url}/${reservationId}`, reservation, { headers: headers });
        await firstValueFrom(update);

        //Anropar loadReservations för att uppdatera bokningsförfrågningar
        await this.loadReservations();
    }


    //Radera bokningsförfrågan
    async deleteMenuItem(reservationId: number): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const request = this.http.delete<void>(`${this.url}/${reservationId}`, { headers: headers });
        await firstValueFrom(request);


        //Uppdaterar och filtrerar bort bokningförfrågan från signal
        this.reservation.update(reseravations => reseravations.filter(res => res.reservation_id !== reservationId));

    }

    //Formatera tiden 
    private formatTime(time: string | null | undefined): string {
        //Om time saknas returneras en tom sträng
        if (!time) {
            return "";
        }
        //Formeratera enligt HH:mm
        return time.slice(0, 5);
    }

    //Formartera datum
   private formatDate(dateToFormat: string) {
        if (!dateToFormat) {
            return "";
        }
        const date = new Date(dateToFormat);


        //Returnerar omvandlat svenskt datum.
        return date.toLocaleDateString("sv-SE", { day: "numeric", month: "long" })
    }



}

