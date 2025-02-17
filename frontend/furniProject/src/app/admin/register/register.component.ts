import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';

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
  errorMessage = '';
  secret_key = '';
  predifined_secret_key = 'yogi_marathe';

  constructor(private router: Router, private adminApi:AdminApiService) {}



  register() {
    if (this.admin_password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;

    } else if (this.predifined_secret_key === this.secret_key) {

      console.log(this.admin_name, this.admin_mobile, this.admin_email, this.admin_password);


      console.log('Secret Key Match Successfully');
      this.errorMessage = 'Passwords match successfully';
      this.adminApi.adminRegister({ admin_name: this.admin_name, admin_mobile: this.admin_mobile, admin_email: this.admin_email, admin_password: this.admin_password }).subscribe((res: any) => {
        alert('Register Success');
        this.router.navigate(['/admin/login']);
        (err: any) => {
          console.error(err);
          this.errorMessage = 'An error occurred while registering';
        }
      })
    }
    else {
      this.errorMessage = 'Invalid Secret Key';
    }

  }



}
