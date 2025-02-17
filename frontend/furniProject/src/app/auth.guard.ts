
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
      // Admin not logged in but tries to access a protected route
      if (confirm('You are not logged in. Would you like to log in now?')) {
        this.router.navigate(['/admin/login']); // Redirect to admin login
      }
      return false; // Prevent access to the route
    }

    // Allow access if logged in or route doesn't require login
    return true;
  }
}
