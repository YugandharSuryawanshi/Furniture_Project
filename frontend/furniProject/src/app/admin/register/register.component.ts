import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  admin_name = '';
  admin_mobile = '';
  admin_email = '';
  admin_password = '';
  confirmPassword = '';
  secret_key = '';
  predifined_secret_key = 'yogi_marathe';
  loading = false;

  constructor(private router: Router, private adminApi: AdminApiService, private toastr: ToastrService) { }

  // New validation methods
  nameValid() {
    return /^[A-Za-z ]{3,}$/.test(this.admin_name);
  }

  mobileValid() {
    return /^[0-9]{10}$/.test(this.admin_mobile);
  }

  emailValid() {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.admin_email);
  }

  passwordValid() {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(this.admin_password);
  }

  passwordsMatch() {
    return this.admin_password === this.confirmPassword;
  }

  togglePasswordVisibility(fieldId: string) {
    const field = document.getElementById(fieldId);
    if (field) {
      const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
      field.setAttribute('type', type);
    }
  }

  onEmailInput() {
    if (this.admin_email) {
      this.admin_email = this.admin_email.toLowerCase();
    }
  }

  register() {
    this.loading = true;

    // Client-side validations
    if (!this.nameValid()) {
      this.toastr.error('Please enter a valid name (min 3 characters, letters only)', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    if (!this.mobileValid()) {
      this.toastr.error('Please enter a valid 10-digit mobile number', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    if (!this.emailValid()) {
      this.toastr.error('Please enter a valid email address', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    if (!this.passwordValid()) {
      this.toastr.error('Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    if (!this.passwordsMatch()) {
      this.toastr.error('Password and Confirm Password do Not Match', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    if (this.secret_key.length < 8) {
      this.toastr.error('Secret key must be at least 8 characters', 'Error',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
      return;
    }

    // Original logic with enhanced error handling
    if (this.predifined_secret_key === this.secret_key) {
      this.adminApi.adminRegister({
        admin_name: this.admin_name,
        admin_mobile: this.admin_mobile,
        admin_email: this.admin_email,
        admin_password: this.admin_password
      }).subscribe({
        next: (res: any) => {
          this.toastr.success('Registered Successfully!', 'Success',
            { progressBar: true, disableTimeOut: false, closeButton: true });
          this.router.navigate(['/admin/login']);
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error(err.error.message || 'Registration failed. Please try again.', 'Error',
            { progressBar: true, disableTimeOut: false, closeButton: true });
          this.loading = false;
        }
      });
    } else {
      this.toastr.warning('Invalid Secret Key. Please try again or contact the administrator.', 'Warning',
        { progressBar: true, disableTimeOut: false, closeButton: true });
      this.loading = false;
    }
  }

}
