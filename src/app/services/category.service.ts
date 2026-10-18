import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category } from '../models/category.interface';
import { AuthService } from './auth.service';
import { MenuitemService } from './menuItem.service';


@Service()
export class CategoryService {
    private url: string = "http://localhost:3000/api/categories"

    http = inject(HttpClient);

    //Signal 
    categories = signal<Category[]>([]);


    //Hämtar service
    authService = inject(AuthService);
    menuitemService = inject(MenuitemService)




    //Hämta kategorier
    async getCategories(): Promise<Category[]> {
        const categories = this.http.get<Category[]>(this.url);
        return await firstValueFrom(categories);
    }

    //Laddar kategorier
    async loadCategories() {
        const response = await this.getCategories();
        //Uppdatera signal
        this.categories.set(response);
    }

    //Skapa ny kategori
    async createCategory(category: Category): Promise<void> {

        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }


        const newCategory = this.http.post<Category>(this.url, category, { headers: headers });
        await firstValueFrom(newCategory);

        //Anropar loadCategories för att uppdatera kategorier
        await this.loadCategories();
    }

    //Uppdatera kategori
    async updateCategory(categoryId: number, category: Category): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const update = this.http.put<Category>(`${this.url}/${categoryId}`, category, { headers: headers });
        await firstValueFrom(update);

        //Anropar loadCategories för att uppdatera kategorier
        await this.loadCategories();
    }


    //Radera kategorier
    async deleteCategory(categoryId: number): Promise<void> {
        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }

        const request = this.http.delete<Category>(`${this.url}/${categoryId}`, { headers: headers });
        await firstValueFrom(request);
        //Uppdaterar och filtrerar bort kategorin och ariktel från signal
        this.categories.update(category => category.filter(cat => cat.category_id !== categoryId));

        this.menuitemService.menuItems.update(items => items.filter(item => item.category_id !== categoryId));

  

        }
    }
