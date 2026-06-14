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

  currentStep = 1;

  admin_name = '';
  admin_mobile = '';
  admin_email = '';
  admin_password = '';
  confirmPassword = '';

  secret_key = '';
  predifined_secret_key = 'yogi_marathe';

  loading = false;

  otp: string[] = ['', '', '', '', '', ''];

  otpVerified = false;

  constructor(
    private router: Router,
    private adminApi: AdminApiService,
    private toastr: ToastrService
  ) { }

  // Send OTP

  generateOTP() {

    if (!this.admin_email || this.loading) {
      return;
    }

    this.loading = true;

    this.adminApi.adminRegisterSendOtp({
      email: this.admin_email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res.message || 'OTP sent successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message || 'Failed to send OTP',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // Next Step

  nextStep() {

    if (this.loading) {
      return;
    }

    this.currentStep = 2;
    this.generateOTP();
  }

  backToStep(step: number) {
    this.currentStep = step;
  }

  // Step 1 Validation

  validateStep1() {

    if (!this.nameValid()) {

      this.toastr.error(
        'Please enter a valid name (minimum 3 characters)',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (!this.mobileValid()) {

      this.toastr.error(
        'Please enter a valid 10-digit mobile number',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (!this.emailValid()) {

      this.toastr.error(
        'Please enter a valid email address',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (!this.passwordValid()) {

      this.toastr.error(
        'Password must contain 8+ characters, 1 uppercase, 1 lowercase and 1 number',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (!this.passwordsMatch()) {

      this.toastr.error(
        'Password and Confirm Password do not match',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (this.secret_key.length < 8) {

      this.toastr.error(
        'Secret key must be at least 8 characters',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (this.secret_key !== this.predifined_secret_key) {

      this.toastr.warning(
        'Invalid Secret Key',
        'Warning',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.nextStep();
  }

  // Verify OTP

  validateOTP() {

    const enteredOTP = this.otp.join('');

    if (enteredOTP.length !== 6) {

      this.toastr.error(
        'Please enter complete 6 digit OTP',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.loading = true;

    this.adminApi.adminRegisterVerifyOtp({
      email: this.admin_email,
      otp: enteredOTP
    }).subscribe({

      next: (res: any) => {

        this.loading = false;
        this.otpVerified = true;

        this.toastr.success(
          res.message || 'OTP verified successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.register();
      },

      error: (err: any) => {

        this.loading = false;
        this.otpVerified = false;

        this.toastr.error(
          err?.error?.message || 'Invalid OTP',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // Register

  register() {

    if (!this.otpVerified) {

      this.toastr.error(
        'Please verify OTP first',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.loading = true;

    this.adminApi.adminRegister({
      admin_name: this.admin_name,
      admin_mobile: this.admin_mobile,
      admin_email: this.admin_email,
      admin_password: this.admin_password
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res.message || 'Admin registered successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.router.navigate(['/admin/login']);
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message || 'Registration failed',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // Resend OTP

  resendOTP(event: Event) {

    event.preventDefault();

    if (this.loading) {
      return;
    }

    this.generateOTP();
  }

  // OTP Input Auto Focus

  moveToNext(index: number, event: any) {

    const value = event.target.value;

    if (!/^\d*$/.test(value)) {
      event.target.value = '';
      this.otp[index] = '';
      return;
    }

    const nextInput = event.target.nextElementSibling;

    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  // Validations

  nameValid() {
    return /^[A-Za-z ]{3,}$/.test(this.admin_name);
  }

  mobileValid() {
    return /^[0-9]{10}$/.test(this.admin_mobile);
  }

  emailValid() {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(this.admin_email);
  }

  passwordValid() {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(this.admin_password);
  }

  passwordsMatch() {
    return this.admin_password === this.confirmPassword;
  }

  togglePasswordVisibility(fieldId: string) {

    const field = document.getElementById(fieldId) as HTMLInputElement;

    if (field) {
      field.type =
        field.type === 'password'
          ? 'text'
          : 'password';
    }
  }

  onEmailInput() {

    if (this.admin_email) {
      this.admin_email =
        this.admin_email.toLowerCase();
    }
  }
}