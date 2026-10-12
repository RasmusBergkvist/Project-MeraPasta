import { inject, Service, signal } from '@angular/core';
import { MenuItem } from '../models/menuItem.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Service()
export class MenuitemService {
    private urlMenuItems: string = "http://localhost:3000/api/menuitems"
    private urlMenuCategory: string = "http://localhost:3000/api/menuitems/category"

    http = inject(HttpClient);

    //Singal 
    menuItems = signal<MenuItem[]>([]);

    //Hämtar service
    authService = inject(AuthService);


    //Hämta menyartiklar som tillhör en viss kategori
    async getMenuCategory(categoryId: number): Promise<MenuItem[]> {
        const menuCategory = this.http.get<MenuItem[]>(`${this.urlMenuCategory}/${categoryId}`);
        return await firstValueFrom(menuCategory);
    }



    //Laddar menyartiklar som tillhör en viss kategori
    async loadMenuCategory(categoryId: number) {
        const response = await this.getMenuCategory(categoryId);

        this.menuItems.set(response);
    }


    //Skapa ny menyartikel
    async createMenuItem(menuItem: MenuItem): Promise<void> {

        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const newMenuItem = this.http.post<void>(this.urlMenuItems, menuItem, { headers: headers });
        await firstValueFrom(newMenuItem);

        //Uppdaterar kategorin för att ny menyartikel
        await this.loadMenuCategory(menuItem.category_id);
    }



    //Uppdatera kategori
    async updateMenuItem(itemId: number, menuItem: MenuItem): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const update = this.http.put<void>(`${this.urlMenuItems}/${itemId}`, menuItem, { headers: headers });
        await firstValueFrom(update);

         //Uppdaterar kategorin för att uppdaterad menyartikel
        await this.loadMenuCategory(menuItem.category_id);
    }


        //Radera menyartikel
    async deleteMenuItem(itemId: number): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const request = this.http.delete<void>(`${this.urlMenuItems}/${itemId}`, { headers: headers });
        await firstValueFrom(request);


         //Uppdaterar och filtrerar bort artikeln från signal
         this.menuItems.update(items => items.filter(item => item.item_id !== itemId));
        
    }

}
