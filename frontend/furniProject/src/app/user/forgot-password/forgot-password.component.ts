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
    otp: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]
    ]
  });

  passwordForm = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    confirmPassword: ['', Validators.required]
  });

  // Send OTP
  sendOtp() {
    if (this.emailForm.invalid) {
      this.toastr.warning('Please enter a valid email address', 'Validation',
        {
          progressBar: true,
          tapToDismiss: true
        }
      );

      return;
    }

    this.email = this.emailForm.value.email || '';

    const data = {
      email: this.email
    };

    this.userApi.sendOtp(data).subscribe({

      next: (res: any) => {
        this.toastr.success(res?.message || 'OTP sent successfully', 'Success',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );

        this.step = 2;
      },

      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Failed to send OTP', 'Error',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );
      }
    });
  }

  // Verify OTP
  verifyOtp() {
    if (this.otpForm.invalid) {
      this.toastr.warning('Please enter a valid 6 digit OTP', 'Validation',
        {
          progressBar: true,
          tapToDismiss: true
        }
      );

      return;
    }

    const data = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.userApi.verifyOtp(data).subscribe({

      next: (res: any) => {
        this.toastr.success(res?.message || 'OTP verified successfully', 'Success',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );

        this.step = 3;
      },

      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Invalid OTP', 'Error',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );
      }
    });
  }

  // Reset Password
  resetPassword() {
    if (this.passwordForm.invalid) {
      this.toastr.warning('Please enter valid password details', 'Validation',
        {
          progressBar: true,
          tapToDismiss: true
        }
      );
      return;
    }

    const password = this.passwordForm.value.password;
    const confirmPassword = this.passwordForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.toastr.error('Passwords do not match', 'Error',
        {
          progressBar: true,
          tapToDismiss: true
        }
      );
      return;
    }

    const data = {
      email: this.email,
      password: password
    };

    this.userApi.resetPassword(data).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Password reset successfully', 'Success',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );
        this.router.navigate(['/user/login']);
      },

      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Password reset failed', 'Error',
          {
            progressBar: true,
            tapToDismiss: true
          }
        );
      }
    });
  }
}