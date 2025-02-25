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

  adminProfile = {
    admin_name: '',
    admin_mobile: '',
    admin_email: '',
    old_password: '',
    new_password: '',
    admin_profile: null,
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.adminProfile.admin_profile = event.target.files[0];
    }
  }

  updateProfile() {

    if (!this.adminProfile.old_password || !this.adminProfile.new_password) {
      this.toastr.warning('Old Password and New Password are required', 'Warning', { progressBar: true, closeButton: true, disableTimeOut: false });
      return;
    }

    if (this.adminProfile.old_password && this.adminProfile.new_password) {
      const formData = new FormData();

      formData.append('admin_name', this.adminProfile.admin_name);
      formData.append('admin_mobile', this.adminProfile.admin_mobile);
      formData.append('admin_email', this.adminProfile.admin_email);
      formData.append('admin_password', this.adminProfile.new_password);
      formData.append('old_password', this.adminProfile.old_password);

      if (this.adminProfile.admin_profile) {
        formData.append('admin_profile', this.adminProfile.admin_profile);
      }

      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No adminToken found');
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.adminApi.updateProfile(formData, headers).subscribe(
        (res: any) => {
          this.toastr.success('Profile Updated Successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          this.getAdminData();
          this.isDivVisible = false;
          this.isBtnVisible = true;
          this.adminProfile.old_password = '';
          this.adminProfile.new_password = '';
        },
        (error) => {
          if (error.error && error.error.message) {
            this.toastr.error('Error updating profile', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
          } else {
            this.toastr.error('An error occurred while updating the profile.', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
          }
        }
      );
    }
    else {
      this.toastr.error('Please fill both Old and New Password', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
    }
  }

  ngOnInit() {
    this.getAdminData();
  }
  adminDetails: any;
  getAdminData() {
    this.adminApi.getAdminDetails()?.subscribe((data: any) => {
      if (data.success) {
        this.adminDetails = data.admin;
        this.adminProfile.admin_name = this.adminDetails.admin_name;
        this.adminProfile.admin_mobile = this.adminDetails.admin_mobile;
        this.adminProfile.admin_email = this.adminDetails.admin_email;
      }
      else {
        console.error('Failed to fetch admin data:', data.message);
      }
    })
  }


  isDivVisible: boolean = false;
  isBtnVisible: boolean = true;
  errorMessage: string = '';
  updateShow_hide() {
    this.isDivVisible = !this.isDivVisible;
    this.isBtnVisible = !this.isBtnVisible;
    this.toastr.warning('Enter Old Password and New Password', 'Warning', { progressBar: true, closeButton: true, disableTimeOut: false });
  }

  logout() {
    this.adminApi.adminLogout();
    this.router.navigate(['/admin/login']);
  }

  // Delete Admin Account
  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.adminApi.deleteAdminAccount().subscribe((res: any) => {
        this.toastr.success('Account Deleted Succcessfully..!','Success' , { progressBar: true, disableTimeOut:false, closeButton: true });
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



}
