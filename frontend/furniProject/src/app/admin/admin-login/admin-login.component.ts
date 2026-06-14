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

    const passwordField =
      document.getElementById('admin_password');

    if (passwordField) {

      const type =
        passwordField.getAttribute('type') === 'password'
          ? 'text'
          : 'password';

      passwordField.setAttribute('type', type);
    }
  }

  toggleOtpVisibility() {

    const otpField =
      document.getElementById('otp');

    if (otpField) {

      const type =
        otpField.getAttribute('type') === 'password'
          ? 'text'
          : 'password';

      otpField.setAttribute('type', type);
    }
  }

  emailValid(): boolean {

    const emailPattern =
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;

    return emailPattern.test(this.admin_email);
  }

  onEmailInput() {

    this.emailTouched = true;

    if (this.admin_email) {
      this.admin_email =
        this.admin_email.toLowerCase();
    }
  }

  onPasswordInput() {
    this.passwordTouched = true;
  }

  private switchStep(
    hideId: string,
    showId: string
  ) {

    const hideEl =
      document.getElementById(hideId);

    const showEl =
      document.getElementById(showId);

    if (hideEl && showEl) {

      hideEl.classList.add(
        'animate__animated',
        'animate__fadeOut'
      );

      setTimeout(() => {

        hideEl.style.display = 'none';
        showEl.style.display = 'block';

        showEl.classList.add(
          'animate__animated',
          'animate__fadeIn'
        );

      }, 500);
    }
  }

  // STEP 1 → EMAIL

  goToPasswordStep() {

    this.emailTouched = true;

    if (!this.emailValid()) {

      this.toastr.error(
        'Please enter a valid email address',
        'Validation Error'
      );

      return;
    }

    this.switchStep(
      'email-step',
      'password-step'
    );

    document
      .querySelector('.step:nth-child(1)')
      ?.classList.add('completed');

    document
      .querySelector('.step:nth-child(3)')
      ?.classList.add('active');

    document
      .querySelectorAll('.step-line')[0]
      ?.classList.add('completed');
  }

  // STEP 2 → PASSWORD VERIFY + SEND OTP

  goToOtpStep() {

    if (this.loading) {
      return;
    }

    this.passwordTouched = true;

    if (
      !this.admin_password ||
      this.admin_password.length < 6
    ) {

      this.toastr.error(
        'Password must be at least 6 characters',
        'Validation Error'
      );

      return;
    }

    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password
    };

    this.loading = true;

    this.adminApi.verifyAdminPassword(admin)
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.adminApi.sendOtp({
              email: this.admin_email
            }).subscribe({

              next: (otpRes: any) => {

                this.loading = false;

                this.switchStep(
                  'password-step',
                  'otp-step'
                );

                document
                  .querySelector('.step:nth-child(3)')
                  ?.classList.add('completed');

                document
                  .querySelector('.step:nth-child(5)')
                  ?.classList.add('active');

                document
                  .querySelectorAll('.step-line')[1]
                  ?.classList.add('completed');

                this.toastr.success(
                  otpRes.message ||
                  'OTP sent successfully',
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
        },

        error: (err: any) => {

          this.loading = false;

          this.toastr.error(
            err?.error?.message ||
            'Invalid credentials',
            'Login Failed',
            {
              progressBar: true,
              closeButton: true
            }
          );
        }
      });
  }

  // STEP 3 → LOGIN

  login() {

    if (this.loading) {
      return;
    }

    if (!this.otp) {

      this.toastr.error(
        'Please enter OTP',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    if (!/^\d{6}$/.test(this.otp)) {

      this.toastr.error(
        'OTP must be 6 digits',
        'Error',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    const admin = {
      admin_email: this.admin_email,
      admin_password: this.admin_password,
      otp: this.otp
    };

    this.loginNow(admin);
  }

  // FINAL LOGIN

  loginNow(admin: any) {

    this.loading = true;

    this.adminApi.adminLogin(admin)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          this.toastr.success(
            res.message ||
            'Login Successful',
            'Success',
            {
              progressBar: true,
              closeButton: true
            }
          );

          if (res?.adminToken) {

            localStorage.setItem(
              'adminToken',
              res.adminToken
            );

            localStorage.setItem(
              'adminEmail',
              this.admin_email
            );

            this.adminApi.setToken(
              res.adminToken
            );

            this.router.navigate([
              '/admin/dashboard'
            ]);
          }
        },

        error: (err: any) => {

          this.loading = false;

          this.toastr.error(
            err?.error?.message ||
            'Login Failed',
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
      email: this.admin_email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.toastr.success(
          res.message ||
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
}