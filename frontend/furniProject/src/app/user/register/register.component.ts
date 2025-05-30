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

  // Input Fields error messages
  nameError: string = '';
  mobileError: string = '';
  emailError: string = '';
  passwordError: string = '';
  otpError: string = '';
  confirmPasswordError: string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  otpSent: boolean = false;
  backendCameOtp: any;
  otpVerified: boolean = false;

  constructor(private userApi: UserApiService, private router: Router, private toastr: ToastrService) { }

  // Name validation
  validateName() {
    const statusName = /^[A-Za-z ]{3,}$/;
    if (!this.formData.user_name) {
      this.nameError = 'Full name is required.';
    } else if (!statusName.test(this.formData.user_name)) {
      this.nameError = 'Name must be at least 3 letters long.';
    } else {
      this.nameError = '';
    }
  }

  // Mobile validation
  validateMobile() {
    const statusMob = /^[0-9]{10}$/;
    if (!this.formData.user_mobile) {
      this.mobileError = 'Mobile number is required.';
    } else if (!statusMob.test(this.formData.user_mobile)) {
      this.mobileError = 'Enter a valid 10-digit mobile number.';
    } else {
      this.mobileError = '';
    }
  }

  // Email validation
  validateEmail() {
    const statusEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!this.formData.user_email) {
      this.emailError = 'Email is required.';
    } else if (!statusEmail.test(this.formData.user_email)) {
      this.emailError = 'Enter a valid email address.';
    } else {
      this.emailError = '';
    }
  }

  // OTP validation
  validateOtp() {
    const statusOtp = /^\d{6}$/;
    if (!this.formData.otp) {
      this.otpError = 'OTP is required.';
    } else if (!statusOtp.test(this.formData.otp)) {
      this.otpError = 'Enter a valid OTP'
    } else {
      this.otpError = ''
    }
  }

  // Password validation
  validatePassword() {
    const statusPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!this.formData.user_password) {
      this.passwordError = 'Password is required.';
    } else if (!statusPass.test(this.formData.user_password)) {
      this.passwordError = 'At least 8 characters, 1 uppercase letter, and 1 number.';
    } else {
      this.passwordError = '';
    }
  }

  // Confirm Password validation
  validateConfirmPassword() {
    if (!this.formData.confirmPassword) {
      this.confirmPasswordError = 'Confirm password is required.';
    } else if (this.formData.user_password !== this.formData.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
    } else {
      this.confirmPasswordError = '';
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  // Send Otp on Email
  sendOtp() {
    if (!this.formData.user_email) {
      this.toastr.warning('Please enter your email!', 'Warning', { progressBar: true, tapToDismiss: true });
      return;
    }

    this.userApi.sendOtp({ email: this.formData.user_email }).subscribe(
      (res: any) => {
        this.backendCameOtp = res.otp;
        this.otpSent = true;
        this.toastr.success(res.message || 'OTP sent to your email', 'Success', { progressBar: true, tapToDismiss: true });
      },
      err => {
        this.toastr.error(err.error.message || 'Error sending OTP', 'Error', { progressBar: true, tapToDismiss: true });
      }
    );
  }

  // Register New User
  register() {
    // Check all validations on submit also
    this.validateName();
    this.validateMobile();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    // If any error, prevent submit
    if (this.nameError || this.mobileError || this.emailError || this.passwordError || this.confirmPasswordError) {
      this.toastr.error('Please Enter valid data before submitting.', 'Requirement Not Full fill', { progressBar: true, tapToDismiss: true });
      return;
    }

    if (this.backendCameOtp == this.formData.otp) {
      
      const formData = new FormData();
      formData.append('user_name', this.formData.user_name);
      formData.append('user_mobile', this.formData.user_mobile);
      formData.append('user_email', this.formData.user_email);
      formData.append('user_password', this.formData.user_password);
      formData.append('otp', this.formData.otp);

      this.userApi.register(this.formData).subscribe((res: any) => {
        if (res.status === 'success') {
          this.toastr.success('User registered successfully!', 'Success', { progressBar: true, tapToDismiss: true });
          this.router.navigate(['/user/login']);
        }
      });
    }
    else {
      this.otpError = 'Please Enter Correct OTP';
    }
  }

}
