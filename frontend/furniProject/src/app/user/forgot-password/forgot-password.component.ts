import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  step = 1;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userApi: UserApiService,
    private router: Router
  ) { }

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required]]
  });

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  // Send Otp
  sendOtp() {
    if (this.emailForm.invalid) return;

    this.email = this.emailForm.value.email!;

    const data = { email: this.email };

    this.userApi.sendOtp(data).subscribe({
      next: () => {
        this.toastr.success('OTP sent');
        this.step = 2;
      },
      error: () => this.toastr.error('Failed to send OTP')
    });
  }

  // Verify Otp
  verifyOtp() {
    if (this.otpForm.invalid) return;

    const data = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.userApi.verifyOtp(data).subscribe({
      next: () => {
        this.toastr.success('OTP verified');
        this.step = 3;
      },
      error: () => this.toastr.error('Invalid OTP')
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

    const data = {
      email: this.email,
      password: password
    };

    this.userApi.resetPassword(data).subscribe({
      next: () => {
        this.toastr.success('Password reset successful');
        this.router.navigate(['/user/login']);
      },
      error: () => this.toastr.error('Reset failed')
    });
  }

}
