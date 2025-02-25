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
  errorMessage = false;

  formData: any = {
      user_name : '',
      user_mobile : '',
      user_email : '',
      user_password : '',
      confirmPassword : ''
    }

  constructor(private userApi: UserApiService, private router: Router, private toastr:ToastrService) { }

  register() {
    this.errorMessage = false;

    // Validate form fields
    if (!this.formData.user_name || !this.formData.user_mobile || !this.formData.user_email || !this.formData.user_password || !this.formData.confirmPassword) {
      this.errorMessage = true;
      return;
    }

    if (this.formData.user_password !== this.formData.confirmPassword) {
      this.errorMessage = true;
      this.toastr.error('Password and Confirm Password Are Not Match', 'Error', { progressBar:true, closeButton:true, disableTimeOut:false});
      return;
    }
    const formData = new FormData();
    formData.append('user_name', this.formData.user_name)
    formData.append('user_mobile', this.formData.user_mobile)
    formData.append('user_email', this.formData.user_email)
    formData.append('user_password', this.formData.user_password);

    // Call API
    this.userApi.register(this.formData).subscribe((res: any) => {
        if (res.status === 'success') {
          this.toastr.success('User register successfully..!', 'success' , { progressBar:true, closeButton:true, disableTimeOut:false});
          this.errorMessage = false;
          this.router.navigate(['/user/login']);
        } else {
          this.toastr.error('User registration failed..!', 'Error' , { progressBar:true, closeButton:true, disableTimeOut:false});
          this.errorMessage = true;
        }
      });
  }





}
