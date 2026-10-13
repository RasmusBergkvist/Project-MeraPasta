import { inject, Service, signal } from '@angular/core';
import { OpeningHours } from '../models/openinghours.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Service()
export class OpeningHoursService {
    private url: string = "http://localhost:3000/api/openinghours"

    http = inject(HttpClient);

    //Signal 
    openingHours = signal<OpeningHours[]>([]);

    //Hämtar service
    authService = inject(AuthService);

    //Hämta öppettider
    async getOpeningHours(): Promise<OpeningHours[]> {
        const openingHours = this.http.get<OpeningHours[]>(this.url);
        return await firstValueFrom(openingHours);
    }

    //Laddar öppettider
    async loadOpeningHours() {
        //Väntar tills öppettiderna har hämtats
        const response = await this.getOpeningHours();

        //Mappar response och formterar tiden
        const formatResponse = response.map(hour => ({
            //Skapa en kopia av hour med dess properties
            ...hour,
            //Formaterar öppnings- och stängningstiden
            open_time: this.formatTime(hour.open_time),
            close_time: this.formatTime(hour.close_time)

        }));

        //Uppdaterar signal med formaterad data.
        this.openingHours.set(formatResponse);
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


    //Lägg till öppettider
    async createOpeningHour(openingHours: OpeningHours) {


        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const newOpeningHour = this.http.post<OpeningHours>(this.url, openingHours, { headers: headers });
        await firstValueFrom(newOpeningHour);

        //Anropar loadCategories för att uppdatera kategorier
        await this.loadOpeningHours();
    }


    //Uppdatera öppettider
    async updateOpeningHours(openId: number, openingHours: OpeningHours): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const update = this.http.put<OpeningHours>(`${this.url}/${openId}`, openingHours, { headers: headers });
        await firstValueFrom(update);

        //Anropar loadOpeningHours för att uppdatera öppettiderna
        await this.loadOpeningHours();
    }


    //Radera öppettider
    async deleteOpeningHour(openId: number): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const request = this.http.delete<OpeningHours>(`${this.url}/${openId}`, { headers: headers });
        await firstValueFrom(request);


        //Uppdaterar och filtrerar bort öppettiden från signal
        this.openingHours.update(hours => hours.filter(hour => hour.open_id !== openId));

    }

}


