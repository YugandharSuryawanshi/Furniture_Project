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
    this.getData();
  }

  users:any = [];
  user_count:any = 0;
  product_count:any = 0;
  product_type_count:any = 0;
  testimonial_count:any = 0;
  blog_count:any = 0;
  
  getData() {
    this.adminApi.get_users().subscribe((response: any) => {
      if (response && response.data) {
        this.users = response.data; // Store the user data array
        this.user_count = this.users.length; // Calculate the total user_count of users
        this.products(); // Fetch and display products as well
        this.productTypeCount(); // Fetch and display product types as well
        this.testimonialCount(); // Fetch and display testimonials as well
        this.blogCount(); // Fetch and display blog posts as well
      }
    })
  }

  products()
  {
    this.adminApi.getProducts().subscribe((data:any)=>{
      this.products = data.products;
      this.product_count = this.products.length;
    })
  }

  productTypeCount()
  {
    this.adminApi.getProductTypes().subscribe((data:any)=>{
      this.product_type_count = data.product_types.length;
    })
  }

  testimonialCount()
  {
    this.adminApi.getTestimonials().subscribe((data:any)=>{
      this.testimonial_count = data.data.length;
    })
  }

  blogCount()
  {
    this.adminApi.getBlogs().subscribe((data:any)=>{
      this.blog_count = data.data.length;
    })
  }

  protectedData:any;
  ngOnInit() {
    if (!this.adminApi.protectRoute()) {
      return;
    }

    this.adminApi.getProtectedData().subscribe(data => {
      this.protectedData = data;
    });

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


  errorMessage:any = '';
  successMessage:any = '';
  userList:boolean = false;
  poster:boolean = true;
  updates:boolean = false;
  showUserList()
  {
    this.userList = true;
    this.poster = false;
    this.updates = false;
  }
  showPoster()
  {
    this.userList = false;
    this.poster = true;
  }

  user_detail:any;
  get_This_User(id:any)
  {
    this.adminApi.get_user(id).subscribe((user:any) =>{
      this.user_detail = user.data;
      this.updates = true;
      this.poster = false;
      this.userList = false;
      this.formData.user_id = this.user_detail.user_id;
      this.formData.user_name = this.user_detail.user_name;
      this.formData.user_email = this.user_detail.user_email;
      this.formData.user_mobile = this.user_detail.user_mobile;
    })

  }

  wrongPass:any= ''
  formData:any =
  {
    user_id: '',
    user_name: '',
    user_email: '',
    user_password: '',
    confirm_password: '',
  }
  updateUser()
  {
    const formData = new FormData();
    
    if(this.formData.user_password!= this.formData.confirm_password)
      {
        this.wrongPass = 'Passwords do not match.!!';
        return;
      }
      const id = this.formData.user_id;
      formData.append('user_name', this.formData.user_name);
      formData.append('user_email', this.formData.user_email);
      formData.append('user_mobile', this.formData.user_mobile);
      formData.append('user_password', this.formData.user_password);
    
    this.adminApi.updateUser(id,formData).subscribe((data:any)=>{
      console.log(data);
      if(data.success)
      {
        this.successMessage = data.message;
        this.formData.user_name = '';
        this.formData.user_email = '';
        this.formData.user_mobile = '';
        this.formData.user_password = '';
        this.wrongPass = '';
        this.userList = true;
        this.poster = false;
        this.updates = false;
        this.getData();
      }
      else
      {
        this.errorMessage = data.error;
      }
    })
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.wrongPass = '';
    }, 3000);
  }


  delete_This_User(id:any)
  {
    this.adminApi.deleteUser(id).subscribe((data:any)=>{
      console.log(data);
      if(data.success)
      {
        this.successMessage = data.message;
        this.getData();
      }
      else
      {
        this.errorMessage = data.error;
      }
    })
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }



}
