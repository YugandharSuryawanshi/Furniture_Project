
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private readonly minimumSkeletonDuration = 700;
  private profileRequestId = 0;

  private readonly defaultProfileImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKlIcH0Q1e2QDuzvM94CnN3vdzXrvebSHNeQ&s';

  constructor(
    private adminApi: AdminApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // Profile loading states
  profileLoading = true;
  profileImageLoading = true;

  updatingProfile = false;
  savingProfileImage = false;

  sendingOtp = false;
  verifyingOtp = false;
  changingPassword = false;

  // Profile details
  loggedInAdmin: any = null;
  loggedInAdminImage: string | null = null;

  formData = {
    admin_name: '',
    admin_mobile: '',
    admin_email: '',
    new_password: '',
    confirm_password: '',
    otp: '',
    admin_profile: null as File | null
  };

  // Profile image
  selectedImage: File | null = null;
  selectedImageName: string | null = null;

  // OTP states
  otpSent = false;
  otpVerified = false;

  ngOnInit(): void {
    this.getAdminProfile();
  }

  private hideSkeletonAfterMinimumTime(
    startedAt: number,
    callback: () => void
  ): void {
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(
      0,
      this.minimumSkeletonDuration - elapsed
    );

    setTimeout(callback, remaining);
  }

  // Get Admin Profile
  getAdminProfile(showSkeleton = true): void {
    const requestId = ++this.profileRequestId;
    const startedAt = Date.now();

    if (showSkeleton) {
      this.profileLoading = true;
    }

    const request = this.adminApi.getAdminDetails();

    if (!request) {
      this.profileLoading = false;
      this.toastr.error(
        'Unable to load admin profile.',
        'Error'
      );
      return;
    }

    request
      .pipe(
        finalize(() => {
          if (showSkeleton) {
            this.hideSkeletonAfterMinimumTime(startedAt, () => {
              if (requestId === this.profileRequestId) {
                this.profileLoading = false;
              }
            });
          }
        })
      )
      .subscribe({
        next: (res: any) => {
          if (!res?.admin) {
            this.toastr.error(
              res?.message || 'Unable to load admin details.',
              'Error'
            );
            return;
          }

          this.loggedInAdmin = res.admin;

          this.formData.admin_name =
            this.loggedInAdmin.admin_name || '';

          this.formData.admin_email =
            this.loggedInAdmin.admin_email || '';

          this.formData.admin_mobile =
            this.loggedInAdmin.admin_mobile || '';

          this.setProfileImage(this.loggedInAdmin.admin_profile);
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message || 'Failed to load admin profile.',
            'Error'
          );
        }
      });
  }

  // Set Profile Image
  private setProfileImage(profile: string | null | undefined): void {
    this.profileImageLoading = true;

    if (profile) {
      // Keep the existing backend uploads path.
      this.loggedInAdminImage =
        `http://localhost:4000/uploads/${profile}`;
    } else {
      this.loggedInAdminImage = this.defaultProfileImage;
    }
  }

  // Profile image loaded successfully
  onProfileImageLoad(): void {
    this.profileImageLoading = false;
  }

  // Use default image if profile image cannot load
  onProfileImageError(): void {
    if (this.loggedInAdminImage !== this.defaultProfileImage) {
      this.loggedInAdminImage = this.defaultProfileImage;
    } else {
      this.profileImageLoading = false;
    }
  }

  // Update Admin Personal Details
  updateAdmin(): void {
    if (this.updatingProfile) {
      return;
    }

    if (
      !this.formData.admin_name.trim() ||
      !this.formData.admin_mobile.trim() ||
      !this.formData.admin_email.trim()
    ) {
      this.toastr.warning(
        'Please fill in all profile fields.',
        'Warning'
      );
      return;
    }

    const formData = new FormData();

    formData.append('admin_name', this.formData.admin_name.trim());
    formData.append('admin_mobile', this.formData.admin_mobile.trim());
    formData.append('admin_email', this.formData.admin_email.trim());

    this.updatingProfile = true;

    this.adminApi.updateAdminDetails(formData)
      .pipe(
        finalize(() => {
          this.updatingProfile = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              'Admin details updated successfully!',
              'Success',
              {
                progressBar: true,
                closeButton: true
              }
            );

            this.getAdminProfile(false);
          } else {
            this.toastr.error(
              res?.message || 'Failed to update admin details.',
              'Error'
            );
          }
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message ||
            err?.message ||
            'Server error while updating profile.',
            'Error'
          );
        }
      });
  }

  // Select Profile Image
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastr.warning(
        'Please select a valid image file.',
        'Invalid File'
      );

      input.value = '';
      return;
    }

    this.selectedImage = file;
    this.selectedImageName = file.name;
  }

  // Update Profile Image
  UpdateProfile(): void {
    if (this.savingProfileImage) {
      return;
    }

    if (!this.selectedImage) {
      this.toastr.warning(
        'Please select an image first!',
        'Warning'
      );
      return;
    }

    const formData = new FormData();

    formData.append(
      'admin_profile',
      this.selectedImage,
      this.selectedImage.name
    );

    this.savingProfileImage = true;

    this.adminApi.updateAdminProfile(formData)
      .pipe(
        finalize(() => {
          this.savingProfileImage = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              'Profile image updated successfully!',
              'Success',
              {
                progressBar: true,
                closeButton: true
              }
            );

            this.selectedImage = null;
            this.selectedImageName = null;

            const fileInput = document.getElementById(
              'fileInput'
            ) as HTMLInputElement | null;

            if (fileInput) {
              fileInput.value = '';
            }

            this.getAdminProfile(false);
          } else {
            this.toastr.error(
              res?.message || 'Failed to update profile image.',
              'Error'
            );
          }
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message ||
            err?.message ||
            'Server error while uploading profile image.',
            'Error'
          );
        }
      });
  }

  // Send OTP
  sendOtp(): void {
    if (this.sendingOtp) {
      return;
    }

    const email = this.formData.admin_email.trim();

    if (!email) {
      this.toastr.warning(
        'Please enter your email!',
        'Warning'
      );
      return;
    }

    this.sendingOtp = true;

    this.adminApi.sendOtp({ email })
      .pipe(
        finalize(() => {
          this.sendingOtp = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.toastr.success(
            res?.message || 'OTP sent to your email.',
            'Success',
            {
              progressBar: true,
              tapToDismiss: true
            }
          );

          this.formData.otp = '';
          this.formData.new_password = '';
          this.formData.confirm_password = '';

          this.otpSent = true;
          this.otpVerified = false;
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message ||
            err?.message ||
            'Error sending OTP.',
            'Error',
            {
              progressBar: true,
              tapToDismiss: true
            }
          );
        }
      });
  }

  // Verify OTP
  verifyOtp(): void {
    if (this.verifyingOtp) {
      return;
    }

    if (!this.formData.otp.trim()) {
      this.toastr.warning(
        'Please enter the OTP!',
        'Warning'
      );
      return;
    }

    this.verifyingOtp = true;

    this.adminApi.verifyOtp({
      email: this.formData.admin_email.trim(),
      otp: this.formData.otp.trim()
    })
      .pipe(
        finalize(() => {
          this.verifyingOtp = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.toastr.success(
            res?.message || 'OTP verified successfully.',
            'Success',
            {
              progressBar: true,
              tapToDismiss: true
            }
          );

          this.otpVerified = true;
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message ||
            err?.message ||
            'OTP verification failed.',
            'Error',
            {
              progressBar: true,
              tapToDismiss: true
            }
          );
        }
      });
  }

  // Change Admin Password
  changePass(): void {
    if (this.changingPassword) {
      return;
    }

    if (!this.otpVerified) {
      this.toastr.warning(
        'Please verify your OTP first.',
        'Warning'
      );
      return;
    }

    if (
      !this.formData.new_password ||
      !this.formData.confirm_password
    ) {
      this.toastr.warning(
        'Please fill in both password fields.',
        'Warning'
      );
      return;
    }

    if (this.formData.new_password.length < 6) {
      this.toastr.warning(
        'Password must contain at least 6 characters.',
        'Warning'
      );
      return;
    }

    if (
      this.formData.new_password !==
      this.formData.confirm_password
    ) {
      this.toastr.error(
        'New password and confirm password do not match!',
        'Error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('new_password', this.formData.new_password);

    this.changingPassword = true;

    this.adminApi.updatePassword(formData)
      .pipe(
        finalize(() => {
          this.changingPassword = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              'Your password has been changed successfully.',
              'Congratulations',
              {
                progressBar: true,
                closeButton: true
              }
            );

            this.resetOtpFlow();
          } else {
            this.toastr.error(
              res?.message || 'Failed to change password.',
              'Error'
            );
          }
        },

        error: (err: any) => {
          this.toastr.error(
            err?.error?.message ||
            err?.message ||
            'An unexpected error occurred. Please try again.',
            'Error',
            {
              progressBar: true,
              closeButton: true
            }
          );
        }
      });
  }

  // Reset OTP and password form
  resetOtpFlow(): void {
    this.otpSent = false;
    this.otpVerified = false;

    this.formData.otp = '';
    this.formData.new_password = '';
    this.formData.confirm_password = '';
  }

  // Admin Logout
  logout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }

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
}
