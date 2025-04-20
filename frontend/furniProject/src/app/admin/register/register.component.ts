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
  generatedOTP = '';

  constructor(private router: Router, private adminApi: AdminApiService, private toastr: ToastrService) {
  }

  generateOTP() {
    this.adminApi.sendOtp({ email: this.admin_email }).subscribe((res: any) => {
      this.generatedOTP = res.otp;
      this.toastr.success('Otp is sent', 'Success', {
        progressBar: true, disableTimeOut: false, closeButton: true
      });
    },
      err => {
        this.toastr.error(err.error.message || 'Failed to resend OTP', 'Error', { progressBar: true, tapToDismiss: true });
      });
  }

  // Navigation between steps
  nextStep() {
    this.currentStep++;
    this.generateOTP();
  }

  backToStep(step: number) {
    this.currentStep = step;
  }

  //validation
  validateStep1() {
    if (!this.nameValid()) {
      this.toastr.error('Please enter a valid name (min 3 characters, letters only)', 'Error' , { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (!this.mobileValid()) {
      this.toastr.error('Please enter a valid 10-digit mobile number', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (!this.emailValid()) {
      this.toastr.error('Please enter a valid email address', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (!this.passwordValid()) {
      this.toastr.error('Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (!this.passwordsMatch()) {
      this.toastr.error('Password and Confirm Password do not match', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (this.secret_key.length < 8) {
      this.toastr.error('Secret key must be at least 8 characters', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    if (this.secret_key !== this.predifined_secret_key) {
      this.toastr.warning('Invalid Secret Key. Please try again or contact the administrator.', 'Warning', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    // If all validations are done then, proceed to send OTP
    this.nextStep();
  }

  //validation (OTP)
  validateOTP() {
    const enteredOTP = this.otp.join('');

    if (enteredOTP.length !== 6) {
      this.toastr.error('Please enter the complete 6-digit OTP', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      return;
    }

    // If OTP is valid, proceed to register
    if (enteredOTP == this.generatedOTP) {
      this.register();
    }
    else {
      this.toastr.error('Invalid OTP. Please try again.', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
    }
  }

  // Final registration
  register() {
    this.loading = true;
    this.adminApi.adminRegister({
      admin_name: this.admin_name,
      admin_mobile: this.admin_mobile,
      admin_email: this.admin_email,
      admin_password: this.admin_password,
      otp: this.generatedOTP
    }).subscribe({
      next: (res: any) => {
        this.toastr.success('Registered Successfully! Login Now...', 'Success',
          { progressBar: true, disableTimeOut: false, closeButton: true });
        this.router.navigate(['/admin/login']);
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error(err.error.message || 'Registration failed. Please try again.', 'Error', { progressBar: true, tapToDismiss: true });
        this.loading = false;
        this.backToStep(1);
      }
    });
  }

  // Helper methods
  resendOTP(event: Event) {
    event.preventDefault();
    this.generateOTP();
    this.toastr.success('New OTP has been sent to your email', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
  }

  moveToNext(index: number, event: any) {
    const nextInput = event.target.nextElementSibling;
    if (event.target.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  // Validation methods
  nameValid() {
    return /^[A-Za-z ]{3,}$/.test(this.admin_name);
  }

  mobileValid() {
    return /^[0-9]{10}$/.test(this.admin_mobile);
  }

  emailValid() {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.admin_email);
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
      field.type = field.type === 'password' ? 'text' : 'password';
    }
  }

  onEmailInput() {
    if (this.admin_email) {
      this.admin_email = this.admin_email.toLowerCase();
    }
  }
}