import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  admin_name = '';
  admin_mobile = '';
  admin_email = '';
  admin_password = '';
  confirmPassword = '';
  secret_key = '';
  predifined_secret_key = 'yogi_marathe';

  constructor(private router: Router, private adminApi:AdminApiService, private toastr:ToastrService) {}

  register() {
    if (this.admin_password !== this.confirmPassword) {
    this.toastr.error('Password and Confirm Password do Not Match, Please Try Again..!', 'Success' , { progressBar: true, disableTimeOut:false, closeButton: true });
      return;
    } else if (this.predifined_secret_key === this.secret_key) {
      this.adminApi.adminRegister(
        {
          admin_name: this.admin_name,
          admin_mobile: this.admin_mobile,
          admin_email: this.admin_email,
          admin_password: this.admin_password
        }).subscribe((res: any) => {
          this.toastr.success('Register Successfully..!', 'Success' , { progressBar: true, disableTimeOut:false, closeButton: true });
          this.router.navigate(['/admin/login']);
        (err: any) => {
          console.error(err);
          this.toastr.error('An error occurred while registering', 'Error' , { progressBar: true, disableTimeOut:false, closeButton: true });
        }
      })
    }
    else {
      this.toastr.warning('Invalid Secret Key, Please Try Again..! OR Contact With the Manager', 'Error' , { progressBar: true, disableTimeOut:false, closeButton: true });
    }

  }

}
