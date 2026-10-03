import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { UserFooterComponent } from './user-footer/user-footer.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { LoaderComponent } from './loader/loader.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, UserNavbarComponent, UserFooterComponent, AdminNavbarComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Furni Project';

  isAdminRoute = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route starts with '/admin'
        this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
      }
    });
  }

}