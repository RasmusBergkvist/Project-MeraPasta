import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Users } from './pages/users/users';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "home", component: Home },
    { path: "dashboard", component: Dashboard, canActivate: [authGuard] },
    { path: "admin", component: Dashboard, canActivate: [authGuard] },
    { path: "login", component: Login },
    {path: "users", component: Users, canActivate: [authGuard, adminGuard]},
    { path: "**", redirectTo: "", pathMatch: "full" }
];
