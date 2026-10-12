import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category } from '../models/category.interface';
import { AuthService } from './auth.service';

@Service()
export class CategoryService {
    private url: string = "http://localhost:3000/api/categories"

    http = inject(HttpClient);

    //Signal 
    categories = signal<Category[]>([]);


    //Hämtar service
    authService = inject(AuthService);



    //Hämta kategorier
    async getCategories(): Promise<Category[]> {
        const categories = this.http.get<Category[]>(this.url);
        return await firstValueFrom(categories);
    }

    //Laddar kategorier
    async loadCategories() {
        const response = await this.getCategories();
        this.categories.set(response);
    }

    //Skapa ny kategori
    async createCategory(category: Category): Promise<void> {

        //Skapar en headers
        const headers = {
            "Authorization": `Bearer ${this.authService.token()}`
        }



        const newCategory = this.http.post<void>(this.url, category, { headers: headers });
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

        const update = this.http.put<void>(`${this.url}/${categoryId}`, category, { headers: headers });
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

        const request = this.http.delete<void>(`${this.url}/${categoryId}`, { headers: headers });
        await firstValueFrom(request);
        //Anropar loadCategories för att uppdatera kategorier
        await this.loadCategories();
    }
}
