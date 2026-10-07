import { inject, Service, signal } from '@angular/core';
import { OpeningHours } from '../models/openinghours.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Service()
export class OpeningHoursService {
    private url: string = "http://localhost:3000/api/openinghours"

    http = inject(HttpClient);

    //Signal 
    openingHours = signal<OpeningHours[]>([]);

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

}


