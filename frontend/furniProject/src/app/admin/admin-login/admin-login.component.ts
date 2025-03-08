import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  constructor(private adminApi: AdminApiService, public router: Router, private toastr: ToastrService) { }

  admin_email = '';
  admin_password = '';
  loading = false;
  emailTouched = false;
  passwordTouched = false;

  togglePasswordVisibility() {
    const passwordField = document.getElementById('admin_password');
    if (passwordField) {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
    }
  }

  emailValid(): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(this.admin_email);
  }

  onEmailInput() {
    this.emailTouched = true;  // Mark email as touched when user starts typing
    if (this.admin_email) {
      this.admin_email = this.admin_email.toLowerCase();
    }
  }

  onPasswordInput() {
    this.passwordTouched = true; // Mark password as touched when user starts typing
  }

  login() {
    if (!this.admin_email || !this.admin_password) {
      this.toastr.error('Please enter both email and password', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password
    };

    this.adminApi.adminLogin(admin).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success', {
          progressBar: true, disableTimeOut: false, closeButton: true
        });
        if (res && res.adminToken) {
          localStorage.setItem('adminToken', res.adminToken);
          localStorage.setItem('adminEmail', this.admin_email);
          this.adminApi.setToken(res.adminToken);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toastr.error('Invalid response from server. Please try again.', '', {
            progressBar: true, disableTimeOut: false, closeButton: true
          });
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Invalid credentials', 'Login Failed', {
          progressBar: true, disableTimeOut: false, closeButton: true
        });
      }
    });
  }

}
