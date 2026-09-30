import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "home", component: Home },
    { path: "dashboard", component: Dashboard },
    { path: "admin", component: Dashboard },
    { path: "login", component: Login },
    { path: "**", redirectTo: "", pathMatch: "full" }
];
