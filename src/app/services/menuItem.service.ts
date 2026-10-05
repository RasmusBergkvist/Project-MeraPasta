import { inject, Service, signal } from '@angular/core';
import { MenuItem } from '../models/menuItem.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Service()
export class MenuitemService {
    private urlMenuItems: string = "http://localhost:3000/api/menuitems/"
    private urlMenuCategory: string = "http://localhost:3000/api/menuitems/category/"

    http = inject(HttpClient);

    //Singal 
    menuItems = signal<MenuItem[]>([]);

    //Hämta menyartiklar
    async getMenuItems(): Promise<MenuItem[]> {
        const menuItems = this.http.get<MenuItem[]>(this.urlMenuItems);
        return await firstValueFrom(menuItems);
    }

    //Hämta menyartiklar som tillhör en viss kategori
    async getMenuCategory(categoryId: number): Promise<MenuItem[]> {
        const menuCategory = this.http.get<MenuItem[]>(`${this.urlMenuCategory}${categoryId}`);
        return await firstValueFrom(menuCategory);
    }


    //Laddar menyartiklar
    async loadMenuItems() {
        const response = await this.getMenuItems();
        this.menuItems.set(response);
    }


    //Laddar menyartiklar som tillhör en viss kategori
    async loadMenuCategory(categoryId: number) {
        const response = await this.getMenuCategory(categoryId);
        this.menuItems.set(response);
    }





}
