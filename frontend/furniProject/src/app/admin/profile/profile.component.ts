import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private adminApi:AdminApiService, private router:Router){ }

  adminProfile = {
    admin_name: '',
    admin_mobile: '',
    admin_email: '',
    old_password: '',
    new_password: '',
    admin_profile: null,
  }

  onFileChange(event: any)
  {
    if (event.target.files && event.target.files.length > 0)
    {
      this.adminProfile.admin_profile = event.target.files[0];
      console.log('Selected Image Is :- '+this.adminProfile.admin_profile);
    }
  }

updateProfile() {

  if (this.adminProfile.old_password && this.adminProfile.new_password) {
    const formData = new FormData();

  formData.append('admin_name', this.adminProfile.admin_name);
  formData.append('admin_mobile', this.adminProfile.admin_mobile);
  formData.append('admin_email', this.adminProfile.admin_email);
  formData.append('admin_password', this.adminProfile.new_password);
  formData.append('old_password', this.adminProfile.old_password);

  if (this.adminProfile.admin_profile) {
    formData.append('admin_profile', this.adminProfile.admin_profile);
  } else {
    console.log('No file selected for upload');
  }

  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.error('No adminToken found');
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.adminApi.updateProfile(formData, headers).subscribe(
    (res: any) => {
      alert('Profile updated successfully!');
      this.errorMessage= 'Profile updated successfully!'
      console.log('API response:', res);
      this.getAdminData();
      this.isDivVisible = false;
      this.isBtnVisible = true;
      this.adminProfile.old_password = '';
      this.adminProfile.new_password = '';
    },
    (error) => {
      console.error('Error updating profile:', error);
      if (error.error && error.error.message) {
        this.errorMessage = error.error.message; // Capture error message from API
      } else {
        this.errorMessage = 'An error occurred while updating the profile.';
      }
    }
  );
  }
  else
  {
    this.errorMessage = 'Please fill all the fields';
  }
  setTimeout(() => {
    this.errorMessage = '';
  }, 10000);
}

ngOnInit()
{
  this.getAdminData();
}
adminDetails:any;
getAdminData()
{
  this.adminApi.getAdminDetails()?.subscribe((data:any)=>{
    if (data.success) {
      this.adminDetails = data.admin;
      this.adminProfile.admin_name = this.adminDetails.admin_name;
      this.adminProfile.admin_mobile = this.adminDetails.admin_mobile;
      this.adminProfile.admin_email = this.adminDetails.admin_email;
    }
    else
    {
      console.error('Failed to fetch admin data:', data.message);
    }
  })
}


isDivVisible: boolean = false;
isBtnVisible: boolean = true;
errorMessage:string = '';
updateShow_hide()
{
  this.isDivVisible = !this.isDivVisible;
  this.isBtnVisible =!this.isBtnVisible;
  this.errorMessage = 'Enter Old And New Password';
  setTimeout(() => {
    this.errorMessage = '';
  }, 10000);
}

  
  logout() {
    this.adminApi.adminLogout();
    this.router.navigate(['/admin/login']);
  }


  // Method to delete admin account
  successMessage: string = '';
  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?'))
      {
        this.adminApi.deleteAdminAccount().subscribe((res: any) => {
          console.log('Account deleted:', res);
          this.successMessage = 'Your account has been deleted successfully.';
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 2000); // Redirect after 2 seconds
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'An error occurred while deleting your account.';
          setTimeout(() => {
            this.errorMessage = ''; // Clear error Message after 10 seconds
          }, 10000);
        }
      );
    }
  }



}
