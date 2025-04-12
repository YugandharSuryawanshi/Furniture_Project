import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { UserApiService } from './service/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor(private userApi: UserApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('userToken');
    const requiresLogin = route.data['requiresLogin'];

    if (!token && requiresLogin) {

      const shouldRedirect = confirm('You are not logged in? Login First..!');
      if (shouldRedirect) {
        this.router.navigate(['/user/login']); // Redirect to login
      }
      return false;
    }
    return true;
  }
}