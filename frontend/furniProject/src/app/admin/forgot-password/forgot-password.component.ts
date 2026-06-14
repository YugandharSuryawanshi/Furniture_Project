import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    private adminApi: AdminApiService,
    private router: Router
  ) { }

  // EMAIL FORM

  emailForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]
  });

  // OTP FORM

  otpForm = this.fb.group({
    otp: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ]
  });

  // PASSWORD FORM

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
      [Validators.required]
    ]
  });

  // PASSWORD VISIBILITY

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

  // SEND OTP

  sendOtp() {

    if (this.loading) {
      return;
    }

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
      this.emailForm.value.email!
        .trim()
        .toLowerCase();

    this.loading = true;

    this.adminApi.sendOtp({
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
          err?.error?.message ||
          'Failed to send OTP',
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

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.adminApi.sendOtp({
      email: this.email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message ||
          'OTP resent successfully',
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
          err?.error?.message ||
          'Failed to resend OTP',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }

  // VERIFY OTP

  verifyOtp() {

    if (this.loading) {
      return;
    }

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

    const data = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.loading = true;

    this.adminApi.verifyOtp(data)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          this.toastr.success(
            res?.message ||
            'OTP verified successfully',
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
            err?.error?.message ||
            'Invalid OTP',
            'Error',
            {
              progressBar: true,
              closeButton: true
            }
          );
        }
      });
  }

  // RESET PASSWORD

  resetPassword() {

    if (this.loading) {
      return;
    }

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

    const {
      password,
      confirmPassword
    } = this.passwordForm.value;

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

    this.adminApi.resetPassword(
      this.email,
      password!
    ).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res?.message ||
          'Password reset successful',
          'Success',
          {
            progressBar: true,
            closeButton: true
          }
        );

        this.resetAll();

        this.router.navigate([
          '/admin/login'
        ]);
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message ||
          'Reset failed',
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