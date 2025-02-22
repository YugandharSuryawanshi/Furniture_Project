import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formData:any =
  {
    user_email : '',
    user_password : ''
  }

  constructor(private userApi: UserApiService, private router: Router, private toastr:ToastrService) {}

  login() {
    
    if (!this.formData.user_email || !this.formData.user_password) {
      // alert('Please Email And Password.');
      this.toastr.error('Enter Email and Password', "Error", { disableTimeOut: false, progressBar:true , closeButton: true });
      return;
    }

    const formData = new FormData();
    formData.append('user_email', this.formData.user_email);
    formData.append('user_password', this.formData.user_password);
    
    // Pass the login data to userApi service
    this.userApi.userLogin(this.formData).subscribe((response: any) => {
        // Save token to local storage after successful login
        if (response && response.userToken)
        {
          localStorage.setItem('userToken', response.userToken);
          localStorage.setItem('userEmail', this.formData.user_email);

          this.userApi.setToken(response.userToken);
          this.toastr.success("Login successfully", "Success", { disableTimeOut: false, progressBar:true , closeButton: true });
          this.router.navigate(['/user/home']);
        } else {
          this.toastr.error("Login Error - Invalid User Details", "Error", { disableTimeOut: false, progressBar:true ,closeButton: true });
        }
      });
  }

}
