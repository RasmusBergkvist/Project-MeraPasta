import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Reservation } from '../models/reservation.interface';

@Service()
export class ReservationService {
    private url = "http://localhost:3000/api/reservations";

    http = inject(HttpClient);


    //Skapa bokningsförfrågan
    createReservation(reservation: Reservation) {
    return this.http.post<Reservation>(this.url, reservation);
}


}

