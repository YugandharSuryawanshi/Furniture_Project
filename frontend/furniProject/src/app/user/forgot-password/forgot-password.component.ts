import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  step = 1;
  email = '';
  loading = false;

  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userApi: UserApiService,
    private router: Router
  ) { }

  // Email Form
  emailForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]
  });

  // OTP Form
  otpForm = this.fb.group({
    otp: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]
    ]
  });

  // Password Form
  passwordForm = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        )
      ]
    ],

    confirmPassword: [
      '',
      Validators.required
    ]
  });

  // Toggle Password
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

  // STEP 1
  // SEND OTP

  sendOtp() {

    if (this.emailForm.invalid) {

      this.toastr.error(
        'Please enter a valid email address',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.email =
      this.emailForm.value.email?.toLowerCase() || '';

    this.loading = true;

    this.userApi.sendOtp({
      email: this.email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message || 'OTP sent successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.step = 2;
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

  // RESEND OTP

  resendOtp() {

    this.loading = true;

    this.userApi.sendOtp({
      email: this.email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message || 'OTP resent successfully',
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
          err?.error?.message || 'Failed to resend OTP',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // STEP 2
  // VERIFY OTP

  verifyOtp() {

    if (this.otpForm.invalid) {

      this.toastr.error(
        'Please enter a valid 6 digit OTP',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.loading = true;

    this.userApi.verifyOtp({
      email: this.email,
      otp: this.otpForm.value.otp
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message || 'OTP verified successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.step = 3;
      },

      error: (err: any) => {

        this.loading = false;

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

  // STEP 3
  // RESET PASSWORD

  resetPassword() {

    if (this.passwordForm.invalid) {

      this.toastr.error(
        'Password must contain 8+ characters, 1 uppercase, 1 lowercase and 1 number',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    const password =
      this.passwordForm.value.password;

    const confirmPassword =
      this.passwordForm.value.confirmPassword;

    if (password !== confirmPassword) {

      this.toastr.error(
        'Passwords do not match',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.loading = true;

    this.userApi.resetPassword({
      email: this.email,
      password: password
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message || 'Password reset successfully',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.resetAll();

        this.router.navigate([
          '/user/login'
        ]);
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message || 'Password reset failed',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // RESET FORM

  resetAll() {

    this.step = 1;
    this.email = '';

    this.emailForm.reset();
    this.otpForm.reset();
    this.passwordForm.reset();
  }
}