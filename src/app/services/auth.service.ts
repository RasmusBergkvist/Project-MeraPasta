import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoginResponse } from '../models/login.response';
import { LoginUser } from '../models/login.user';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private url: string = "http://localhost:3000/api/users"
    http = inject(HttpClient);
    router = inject(Router);

    //Signal token
    token = signal(localStorage.getItem("token") || "");

    //Signal username och role
    currentUsername = signal(localStorage.getItem("username") || "");
    currentUserRole = signal(localStorage.getItem("role") || "");

    //Kontroll om användare är inloggad
    isLoggedIn = computed(() => !!this.token());
    //Kontroll om användare är admin
    isAdmin = computed(() => this.currentUserRole() === "admin");

    //Inloggning
    async login(loginUser: LoginUser): Promise<void> {
        const login = this.http.post<LoginResponse>(this.url + "/login", loginUser);
        const response = await firstValueFrom(login);

        //Spara token, username och roll i Local Storage
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("role", response.role);

        //Uppdaterar signal med token, currentUsername och currentUserRole
        this.token.set(response.token)
        this.currentUsername.set(response.username);
        this.currentUserRole.set(response.role);

    }

    //Utloggning
    logout(): void {
        //Radera token, username och role från Local Storage
        localStorage.removeItem("token");
        localStorage.removeItem("username")
        localStorage.removeItem("role")

        //Rensar signals
        this.token.set("");
        this.currentUsername.set("");
        this.currentUserRole.set("");

        //Omdirigerar till startsidan.
        this.router.navigate(["/"]);


    }

}


