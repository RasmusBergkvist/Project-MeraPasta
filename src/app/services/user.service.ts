import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { User } from '../models/user.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Service()
export class UserService {
    private url: string = "http://localhost:3000/api/users"
    http = inject(HttpClient);

    //Signal användare
    users = signal<User[]>([]);

    //Hämtar service
    authService = inject(AuthService);

    //Skapar en headers
    private headers = {
        "Authorization": `Bearer ${this.authService.token()}`
    }

    //Hämta användare
    async getUsers(): Promise<User[]> {
        const request = this.http.get<User[]>(this.url, {headers: this.headers});
        return await firstValueFrom(request);
    }

    //Ladda användare
    async loadUsers(): Promise<void> {
        const response = await this.getUsers();
        //Uppdaterar signal
        this.users.set(response);
    }

    //Skapa användare
    async registerUser(user: User): Promise<void> {


        const newUser = this.http.post<void>(this.url + "/register", user, {headers: this.headers});
        await firstValueFrom(newUser);

        //Anropar loadUser för att hämta den aktuella användarlistan.
        await this.loadUsers();
    }

    //Radera användare
    async deleteUser(deleteId: number): Promise<void> {
        const request = this.http.delete<void>(`${this.url}/${deleteId}`, {headers: this.headers});
        await firstValueFrom(request);
        //Anropar loadUser för att hämta den aktuella användarlistan.
        await this.loadUsers();
    }



}
