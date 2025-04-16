import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  admin_email = '';
  admin_password = '';
  otp = '';
  loading = false;
  emailTouched = false;
  passwordTouched = false;

  constructor(
    private adminApi: AdminApiService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  togglePasswordVisibility() {
    const passwordField = document.getElementById('admin_password');
    if (passwordField) {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
    }
  }

  toggleOtpVisibility() {
    const otpField = document.getElementById('otp');
    if (otpField) {
      const type = otpField.getAttribute('type') === 'password' ? 'text' : 'password';
      otpField.setAttribute('type', type);
    }
  }

  emailValid(): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(this.admin_email);
  }

  onEmailInput() {
    this.emailTouched = true;
    if (this.admin_email) {
      this.admin_email = this.admin_email.toLowerCase();
    }
  }

  onPasswordInput() {
    this.passwordTouched = true;
  }

  // Animation transitions
  private switchStep(hideId: string, showId: string) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    if (hideEl && showEl) {
      hideEl.classList.add('animate__animated', 'animate__fadeOut');
      setTimeout(() => {
        hideEl.style.display = 'none';
        showEl.style.display = 'block';
        showEl.classList.add('animate__animated', 'animate__fadeIn');
      }, 500);
    }
  }

  goToPasswordStep() {
    this.emailTouched = true;
    if (this.emailValid()) {
      this.switchStep('email-step', 'password-step');
      document.querySelector('.step:nth-child(1)')?.classList.add('completed');
      document.querySelector('.step:nth-child(3)')?.classList.add('active');
      document.querySelectorAll('.step-line')[0]?.classList.add('completed');
    } else {
      this.toastr.error('Invalid email address');
    }
  }

  goToOtpStep() {
    this.passwordTouched = true;
    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password
    };

    this.adminApi.verifyAdminPassword(admin).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          if (this.admin_password.length >= 6) {
            this.switchStep('password-step', 'otp-step');
            document.querySelector('.step:nth-child(3)')?.classList.add('completed');
            document.querySelector('.step:nth-child(5)')?.classList.add('active');
            document.querySelectorAll('.step-line')[1]?.classList.add('completed');

            this.adminApi.sendOtp({ email: this.admin_email }).subscribe((res: any) => {
              this.toastr.success('Password Match And Otp is sended', 'Success', {
                progressBar: true, disableTimeOut: false, closeButton: true
              });
            })
          } else {
            this.toastr.error('Password must be at least 6 characters');
          }
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Invalid credentials', 'Login Failed', {
          progressBar: true, disableTimeOut: false, closeButton: true
        });
      }
    });
  }

  login() {
    if (!this.otp) {
      this.toastr.error('Please enter OTP', 'Error');
      return;
    }

    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password,
      otp: this.otp
    };
    this.adminApi.verifyOtp({email: this.admin_email,otp: this.otp}).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.loginNow(admin);
        }
      },
      err => {
        this.toastr.error(err.error.message || 'OTP verification failed', 'Error', { progressBar: true, tapToDismiss: true });
      }
    );
  }

  loginNow(admin: any) {
  {
    this.adminApi.adminLogin(admin).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        if (res?.adminToken) {
          localStorage.setItem('adminToken', res.adminToken);
          localStorage.setItem('adminEmail', this.admin_email);
          this.adminApi.setToken(res.adminToken);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toastr.error('Invalid response from server. Please try again.');
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Invalid credentials', 'Login Failed');
      }
    });
  }
}

resendOtp()
{
  this.adminApi.sendOtp({ email: this.admin_email }).subscribe((res: any) => {
    this.toastr.success('Otp is resent', 'Success', {
      progressBar: true, disableTimeOut: false, closeButton: true
    });
  },
  err => {
    this.toastr.error(err.error.message || 'Failed to resend OTP', 'Error', { progressBar: true, tapToDismiss: true });
  });
}

}
