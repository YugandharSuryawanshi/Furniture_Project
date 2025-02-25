import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public adminApi:AdminApiService, public router:Router)
  {
    this.getloginAdmin();
  }

  adminName:string = '';
  getloginAdmin()
  {
    this.adminApi.getAdminDetails()?.subscribe((data:any)=>{
      if(data.success)
      {
        const adminDetails = data.admin;
        const firstName = adminDetails.admin_name.split(' ')[0]; // Extract first name
        this.adminName = 'Welcome ' + firstName + '!';
      }
    })
    setTimeout(() => {
      this.adminName = '';
    }, 2000);
  }

}
