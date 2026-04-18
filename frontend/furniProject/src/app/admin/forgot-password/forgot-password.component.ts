import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  step = 1;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private adminApi: AdminApiService,
    private router: Router
  ) { }

  // Email Form
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // OTP Form
  otpForm = this.fb.group({
    otp: ['', [Validators.required]]
  });

  // Password Form
  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  // Send Otp
  sendOtp() {
    if (this.emailForm.invalid) return;
    this.email = this.emailForm.value.email!;
    const data = {
      email: this.email
    };

    this.adminApi.sendOtp(data).subscribe({
      next: () => {
        this.toastr.success('OTP sent successfully');
        this.step = 2;
      },
      error: () => {
        this.toastr.error('Failed to send OTP');
      }
    });
  }

  // Verify Otp
  verifyOtp() {
    if (this.otpForm.invalid) return;

    const data = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.adminApi.verifyOtp(data).subscribe({
      next: () => {
        this.toastr.success('OTP verified');
        this.step = 3;
      },
      error: () => {
        this.toastr.error('Invalid OTP');
      }
    });
  }

  // Reset Password
  resetPassword() {
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;

    if (password !== confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.adminApi.resetPassword(this.email, password!).subscribe({
      next: () => {
        this.toastr.success('Password reset successful');
        this.resetAll();
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.toastr.error('Reset failed');
      }
    });
  }

  // Reset All
  resetAll() {
    this.step = 1;
    this.emailForm.reset();
    this.otpForm.reset();
    this.passwordForm.reset();
  }

}
