import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = !!localStorage.getItem('adminToken'); // Check if admin is logged in
    const requiresLogin = route.data['requiresLogin'] as boolean; // Check if the route requires login

    if (!isLoggedIn && requiresLogin) {
      if (confirm('You are not logged in. Would you like to log in now?')) {
        this.router.navigate(['/admin/login']);
      }
      return false; // Prevent access to the route
    }
    return true;
  }
}
