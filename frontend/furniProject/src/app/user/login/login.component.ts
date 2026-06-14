import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formData = {
    user_email: '',
    user_password: ''
  };

  loading = false;

  constructor(
    private userApi: UserApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // Email Validation
  emailValid(): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(
      this.formData.user_email
    );
  }

  // Convert Email To Lowercase
  onEmailInput() {
    if (this.formData.user_email) {
      this.formData.user_email =
        this.formData.user_email.toLowerCase();
    }
  }

  login() {

    // Email Required
    if (!this.formData.user_email) {
      this.toastr.error(
        'Please enter email address',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );
      return;
    }

    // Email Format Check
    if (!this.emailValid()) {
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

    // Password Required
    if (!this.formData.user_password) {
      this.toastr.error(
        'Please enter password',
        'Validation Error',
        {
          progressBar: true,
          closeButton: true
        }
      );
      return;
    }

    this.loading = true;

    this.userApi.userLogin(this.formData).subscribe({

      next: (response: any) => {

        this.loading = false;

        if (response?.userToken) {

          localStorage.setItem(
            'userToken',
            response.userToken
          );

          localStorage.setItem(
            'userEmail',
            this.formData.user_email
          );

          this.userApi.setToken(
            response.userToken
          );

          this.toastr.success(
            response?.message || 'Login successful',
            'Success',
            {
              progressBar: true,
              closeButton: true
            }
          );

          this.router.navigate([
            '/user/home'
          ]);

        } else {

          this.toastr.error(
            'Invalid email or password',
            'Login Failed',
            {
              progressBar: true,
              closeButton: true
            }
          );
        }
      },

      error: (err: any) => {

        this.loading = false;

        this.toastr.error(
          err?.error?.message ||
          'Invalid email or password',
          'Login Failed',
          {
            progressBar: true,
            closeButton: true
          }
        );
      }
    });
  }
}