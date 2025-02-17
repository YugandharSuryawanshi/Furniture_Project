import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { UserFooterComponent } from './user-footer/user-footer.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, UserNavbarComponent, UserFooterComponent, AdminNavbarComponent, AdminFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Furni Project';

  isAdminRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route starts with '/admin'
        this.isAdminRoute = event.url.startsWith('/admin');
      }
    });
  }


}
