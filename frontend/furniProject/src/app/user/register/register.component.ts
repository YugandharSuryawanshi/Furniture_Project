import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formData: any = {
    user_name: '',
    user_mobile: '',
    user_email: '',
    user_password: '',
    confirmPassword: '',
    otp: ''
  };

  nameError = '';
  mobileError = '';
  emailError = '';
  passwordError = '';
  otpError = '';
  confirmPasswordError = '';

  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';

  otpSent = false;
  otpVerified = false;
  loading = false;

  constructor(
    private userApi: UserApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // =========================
  // NAME VALIDATION
  // =========================

  validateName() {

    const pattern = /^[A-Za-z ]{3,}$/;

    if (!this.formData.user_name) {
      this.nameError = 'Full name is required.';
    }
    else if (!pattern.test(this.formData.user_name)) {
      this.nameError = 'Name must be at least 3 letters long.';
    }
    else {
      this.nameError = '';
    }
  }

  // =========================
  // MOBILE VALIDATION
  // =========================

  validateMobile() {

    const pattern = /^[0-9]{10}$/;

    if (!this.formData.user_mobile) {
      this.mobileError = 'Mobile number is required.';
    }
    else if (!pattern.test(this.formData.user_mobile)) {
      this.mobileError = 'Enter a valid 10-digit mobile number.';
    }
    else {
      this.mobileError = '';
    }
  }

  // =========================
  // EMAIL VALIDATION
  // =========================

  validateEmail() {

    if (this.formData.user_email) {
      this.formData.user_email =
        this.formData.user_email.toLowerCase().trim();
    }

    const pattern =
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!this.formData.user_email) {
      this.emailError = 'Email is required.';
    }
    else if (!pattern.test(this.formData.user_email)) {
      this.emailError = 'Enter a valid email address.';
    }
    else {
      this.emailError = '';
    }
  }

  // =========================
  // OTP VALIDATION
  // =========================

  validateOtp() {

    const pattern = /^\d{6}$/;

    if (!this.formData.otp) {
      this.otpError = 'OTP is required.';
    }
    else if (!pattern.test(this.formData.otp)) {
      this.otpError = 'Enter a valid 6-digit OTP.';
    }
    else {
      this.otpError = '';
    }
  }

  // =========================
  // PASSWORD VALIDATION
  // =========================

  validatePassword() {

    const pattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!this.formData.user_password) {
      this.passwordError = 'Password is required.';
    }
    else if (!pattern.test(this.formData.user_password)) {
      this.passwordError =
        'At least 8 characters, 1 uppercase letter and 1 number.';
    }
    else {
      this.passwordError = '';
    }
  }

  // =========================
  // CONFIRM PASSWORD
  // =========================

  validateConfirmPassword() {

    if (!this.formData.confirmPassword) {
      this.confirmPasswordError =
        'Confirm password is required.';
    }
    else if (
      this.formData.user_password !==
      this.formData.confirmPassword
    ) {
      this.confirmPasswordError =
        'Passwords do not match.';
    }
    else {
      this.confirmPasswordError = '';
    }
  }

  // =========================
  // PASSWORD VISIBILITY
  // =========================

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password'
        ? 'text'
        : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password'
        ? 'text'
        : 'password';
  }

  // =========================
  // SEND OTP
  // =========================

  sendOtp() {

    this.validateEmail();

    if (this.emailError) {

      this.toastr.warning(
        'Please enter a valid email address',
        'Validation'
      );

      return;
    }

    this.loading = true;
    this.otpVerified = false;

    this.userApi.registerSendOtp({
      email: this.formData.user_email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;
        this.otpSent = true;

        this.toastr.success(
          res.message || 'OTP sent successfully',
          'Success'
        );
      },

      error: (err: any) => {

        this.loading = false;
        this.otpSent = false;
        this.otpVerified = false;

        this.toastr.error(
          err?.error?.message || 'Failed to send OTP',
          'Error'
        );
      }
    });
  }

  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp() {

    this.validateEmail();
    this.validateOtp();

    if (this.emailError || this.otpError) {
      return;
    }

    if (!this.otpSent) {

      this.toastr.warning(
        'Please send OTP first',
        'Warning'
      );

      return;
    }

    this.loading = true;

    this.userApi.registerVerifyOtp({
      email: this.formData.user_email,
      otp: this.formData.otp
    }).subscribe({

      next: (res: any) => {

        this.loading = false;
        this.otpVerified = true;

        this.toastr.success(
          res.message || 'OTP verified successfully',
          'Success'
        );
      },

      error: (err: any) => {

        this.loading = false;
        this.otpVerified = false;

        this.toastr.error(
          err?.error?.message ||
          'OTP verification failed',
          'Error'
        );
      }
    });
  }

  // =========================
  // REGISTER
  // =========================

  register() {

    this.validateName();
    this.validateMobile();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    if (
      this.nameError ||
      this.mobileError ||
      this.emailError ||
      this.passwordError ||
      this.confirmPasswordError
    ) {

      this.toastr.error(
        'Please enter valid information',
        'Validation Error'
      );

      return;
    }

    if (!this.otpVerified) {

      this.toastr.error(
        'Please verify OTP first',
        'Error'
      );

      return;
    }

    this.loading = true;

    const registerData = {
      user_name: this.formData.user_name,
      user_mobile: this.formData.user_mobile,
      user_email: this.formData.user_email,
      user_password: this.formData.user_password
    };

    this.userApi.register(registerData).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res.message || 'User registered successfully',
          'Success'
        );

        this.router.navigate(['/user/login']);
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message ||
          'Registration failed',
          'Error'
        );
      }
    });
  }
}