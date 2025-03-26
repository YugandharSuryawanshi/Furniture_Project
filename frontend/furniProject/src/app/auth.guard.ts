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
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = !!localStorage.getItem('adminToken');
    const requiresLogin = route.data['requiresLogin'] as boolean;

    if (!isLoggedIn && requiresLogin) {
      if (confirm('You are not logged in. Would you like to log in now?')) {
        this.router.navigate(['/admin/login']);
      }
      return false;
    }
    return true;
  }
}
