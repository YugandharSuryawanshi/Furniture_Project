import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  constructor(private adminApi: AdminApiService, public router: Router) { }

  admin_email = '';
  admin_password = '';
  errorMessage: string = ''; // For displaying login error messages
  isLoading: boolean = false; // For showing a loading indicator

  login() {

    // Validate input fields
    if (!this.admin_email || !this.admin_password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true; // Show loading indicator
    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password
    };

    this.adminApi.adminLogin(admin).subscribe(response => {
      this.isLoading = false; // Hide loading indicator
      if (response && response.adminToken) {
        localStorage.setItem('adminToken', response.adminToken);
        // Optionally store admin details if returned
        localStorage.setItem('adminEmail', this.admin_email);
        
        this.adminApi.setToken(response.adminToken);
        this.router.navigate(['/admin/home']);
      } else {
        this.errorMessage = 'Invalid response from server. Please try again.';
      }
    });
  }

}
