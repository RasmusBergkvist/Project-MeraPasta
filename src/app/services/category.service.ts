import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category } from '../models/category.interface';

@Service()
export class CategoryService {
    private url: string = "http://localhost:3000/api/categories"

    http = inject(HttpClient);

    //Signal 
    categories = signal<Category[]>([]);

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
}
