import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private adminApi: AdminApiService, private router: Router, private toastr: ToastrService) { }

  formData =
    {
      admin_name: '',
      admin_mobile: '',
      admin_email: '',
      new_password: '',
      confirm_password: '',
      otp:'',
      admin_profile: null
    }
    otpSent = false;
    otpVerified = false;

  ngOnInit() {
    this.getAdminProfile();
  }

  loggedInAdmin: any;
  loggedInAdminImage: any = null;
  // Get User Details
  getAdminProfile() {
    this.adminApi.getAdminDetails()?.subscribe(
      (res: any) => {
        this.loggedInAdmin = res.admin;

        this.loggedInAdminImage = this.loggedInAdmin.admin_profile;
        this.formData.admin_name = this.loggedInAdmin.admin_name;
        this.formData.admin_email = this.loggedInAdmin.admin_email;
        this.formData.admin_mobile = this.loggedInAdmin.admin_mobile;
        if (this.loggedInAdmin.admin_profile) {
          this.loggedInAdminImage = `http://localhost:1000/uploads/${this.loggedInAdmin.admin_profile}`;
        }
        else {
          this.loggedInAdminImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKlIcH0Q1e2QDuzvM94CnN3vdzXrvebSHNeQ&s'; // Placeholder image if Admin profile is not set
        }
      });
  }

  //Update User Details
  updateAdmin() {
    const formData = new FormData();
    formData.append('admin_name', this.formData.admin_name);
    formData.append('admin_mobile', this.formData.admin_mobile);
    formData.append('admin_email', this.formData.admin_email);

    this.adminApi.updateAdminDetails(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Admin details updated successfully!', "Success", { disableTimeOut: false, progressBar: true, closeButton: true });
          this.getAdminProfile();
        } else {
          this.toastr.error('Failed to update admin details: ' + res.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
        }
      },
      error: (err: any) => {
        this.toastr.error('Server error: ' + err.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
      }
    });
  }


  selectedImage: File | null = null;
  selectedImageName: string | null = null;

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.selectedImageName = file.name;
    }
  }

  // Update profile image
  UpdateProfile() {
    if (!this.selectedImage) {
      this.toastr.error('Please select an image first!', "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
      return;
    }

    const formData = new FormData();
    formData.append('admin_profile', this.selectedImage, this.selectedImage.name);

    this.adminApi.updateAdminProfile(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Profile image updated successfully', "Success", { disableTimeOut: false, progressBar: true, closeButton: true });

          this.getAdminProfile();
          // Reset input field
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }

          this.selectedImage = null;
          this.selectedImageName = null;
        } else {
          this.toastr.error('Failed to update profile: ' + res.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
        }
      },
      error: (err: any) => {
        this.toastr.error('Server error: ' + err.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
      }
    });
  }

  //Change Admin Password
  changePass() {
    if (this.formData.new_password !== this.formData.confirm_password) {
      this.toastr.error('New password and Confirm password do not match!', "Error", { disableTimeOut: false, progressBar: true, closeButton: true })
      return;
    }

    if (!this.formData.new_password || !this.formData.confirm_password) {
      this.toastr.warning('All fields are required!', "Warning", { disableTimeOut: false, progressBar: true, closeButton: true });
      return;
    }

    const formData = new FormData();
    formData.append('new_password', this.formData.new_password);

    this.adminApi.updatePassword(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Your Password Changed Successfully', "Congratulations", { disableTimeOut: false, progressBar: true, closeButton: true });
        this.formData.new_password = '';
        this.formData.confirm_password = '';
        this.otpSent = false;
        this.otpVerified = false;
      }
    },
      (err: any) => {
        if (err.status === 404) {
          this.toastr.error(err.message);
        } else if (err.status === 400) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('An unexpected error occurred. Please try again later', "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
        }
      }
    );
  }

  // Logout User
  logout() {
    this.adminApi.adminLogout();
    this.toastr.success(
      'You have been successfully logged out!',
      'Goodbye 👋',
      {
        timeOut: 4000,
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
        enableHtml: true,
        toastClass: 'ngx-toastr custom-toast',
        easing: 'ease-in-out',
        easeTime: 700
      }
    );
    this.router.navigate(['/admin/login']);
  }

  // Delete Admin Account
  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.adminApi.deleteAdminAccount().subscribe((res: any) => {
        this.toastr.success('Account Deleted Succcessfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.adminApi.adminLogout();
        this.router.navigate(['/admin/login']);
      },
        (error) => {
          console.error('Error deleting account:', error);
          this.toastr.error('Error deleting account', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      );
    }
  }
  
  //Send otp
  sendOtp() {
    if (!this.formData.admin_email) {
      this.toastr.warning('Please enter your email!');
      return;
    }

    this.adminApi.sendOtp({ email: this.formData.admin_email }).subscribe(
      (res: any) => {
        this.toastr.success(res.message || 'OTP sent to your email', 'Success', { progressBar: true, tapToDismiss: true });
        this.otpSent = true;
      },
      err => {
        this.toastr.error(err.error.message || 'Error sending OTP', 'Error', { progressBar: true, tapToDismiss: true });
      }
    );
  }

  // Varify OTP
  verifyOtp() {
    if (!this.formData.otp) {
      this.toastr.warning('Please enter the OTP!', 'Warning', { progressBar: true, tapToDismiss: true });
      return;
    }

    this.adminApi.verifyOtp({
      email: this.formData.admin_email,
      otp: this.formData.otp
    }).subscribe(
      (res: any) => {
        this.toastr.success(res.message || 'OTP verified successfully', 'Success', { progressBar: true, tapToDismiss: true });
        this.otpVerified = true;
      },
      err => {
        this.toastr.error(err.error.message || 'OTP verification failed', 'Error', { progressBar: true, tapToDismiss: true });
      }
    );
  }


}
