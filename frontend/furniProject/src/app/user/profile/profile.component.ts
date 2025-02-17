import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(public userApi: UserApiService, public router: Router, public toastr:ToastrService){}

  formData =
    {
      user_name: '',
      user_mobile: '',
      user_email: '',
      user_address: '',
      current_password: '',
      new_password: '',
      confirm_password: '',
      user_profile: null
    }

  ngOnInit() {
    this.getUserProfile();
  }
  
    
  loggedInUser: any;
  loggedInUserImage: any = null;
  // Get User Details
  getUserProfile() {
    this.userApi.getUserDetails().subscribe(
      (res: any) => {
        this.loggedInUser = res;
        this.loggedInUserImage = this.loggedInUser.user_profile;
        this.formData.user_name = this.loggedInUser.user_name;
        this.formData.user_mobile = this.loggedInUser.user_mobile;
        this.formData.user_email = this.loggedInUser.user_email;
        this.formData.user_address = this.loggedInUser.user_address;
        if (this.loggedInUser) {
          this.loggedInUserImage = `http://localhost:1000/uploads/${this.loggedInUser.user_profile}`;
        }
        else {
          this.loggedInUserImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKlIcH0Q1e2QDuzvM94CnN3vdzXrvebSHNeQ&s'; // Placeholder image if user profile is not set
        }
      });
  }

  selectedImage: File | null = null;
  //Update User Details
  updateUser() {

    const formData = new FormData();
    formData.append('user_name', this.formData.user_name);
    formData.append('user_mobile', this.formData.user_mobile);
    formData.append('user_email', this.formData.user_email);
    formData.append('user_address', this.formData.user_address);

    this.userApi.updateUserDetails(formData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.toastr.success('User Details updated successfully', "Success", { disableTimeOut: false,closeButton: true });
          this.getUserProfile(); // Refresh profile
        } else {
          this.toastr.error('Failed to update user details: ' + res.message,"Error", { disableTimeOut: false,closeButton: true });
        }
      },
      error: (err: any) => {
        this.toastr.error('Failed to update user details: Server error' + err.message, "Error", { disableTimeOut: false,closeButton: true });
      }
    });
  }

  // Triggered when a user selects an image
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Update profile image
  UpdateProfile() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('user_profile', this.selectedImage, this.selectedImage.name);

      this.userApi.updateUserProfile(formData).subscribe((res: any) => {
        if (res.status === 'success') {
          this.toastr.success('Profile image updated successfully', "Success", { disableTimeOut: false,closeButton: true });
          this.getUserProfile();
        } else {
          this.toastr.error('Failed to update profile..!', "Error", { disableTimeOut: false,closeButton: true })
        }
      });
    }
    if (!this.selectedImage) {
      this.toastr.error('Please Select an Image..!', "Error", { disableTimeOut: false,closeButton: true })
      return;
    }
  }

  //Change User Password
  changePass() {
    const formData = new FormData();

    if (this.formData.new_password !== this.formData.confirm_password) {
      this.toastr.error('New password and Confirm password do not match!', "Error", { disableTimeOut: false,closeButton: true })
      return;
    }

    if (!this.formData.current_password || !this.formData.new_password || !this.formData.confirm_password) {
      this.toastr.warning('All fields are required!', "Warning", { disableTimeOut: false,closeButton: true });
      return;
    }

    formData.append('current_password', this.formData.current_password);
    formData.append('new_password', this.formData.new_password);

    this.userApi.updatePassword(formData).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.toastr.success('Password updated successfully', "Success", { disableTimeOut: false,closeButton: true });
          this.formData.current_password = '';
          this.formData.new_password = '';
          this.formData.confirm_password = '';
        }
      },
      (err: any) => {
        if (err.status === 404) {
          this.toastr.error(err.message);
        } else if (err.status === 400) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('An unexpected error occurred. Please try again later', "Error", { disableTimeOut: false,closeButton: true });
        }
      }
    );
  }

  // Logout User
  logout() {
    const confirmLogout = confirm('Are you sure!! You want to logout');
    if (confirmLogout) {
      this.toastr.success("LogOut successfully", "Success", { disableTimeOut: false,closeButton: true });
      this.userApi.userLogout();
      this.router.navigate(['/user/login']);
    }
    else {
      return;
    }
  }

}
