import { Component } from '@angular/core';
import { AdminApiService } from '../../service/admin-api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private adminApi: AdminApiService, private router: Router, private toastr: ToastrService) {
    this.getData();
  }

  protectedData: any;
  ngOnInit() {
    this.getData();
    if (!this.adminApi.protectRoute()) {
      return;
    }

    this.adminApi.getProtectedData().subscribe(data => {
      this.protectedData = data;
    });
    this.getloginAdmin();
  }

  users: any = [];
  user_count: any = 0;
  product_count: any = 0;
  product_type_count: any = 0;
  testimonial_count: any = 0;
  blog_count: any = 0;
  order_count: any = 0;
  subscriber_count: any = 0;
  team_count: any = 0;

  getData() {
        this.user();
        this.products();
        this.productTypeCount();
        this.testimonialCount();
        this.blogCount();
        this.orders();
        this.subscribers();
        this.team_Meambers();
  }

  user()
  {
    this.adminApi.get_users().subscribe((response: any) => {
      if (response && response.data) {
        this.users = response.data;
        this.user_count = this.users.length;
      }
    })
  }

  products() {
    this.adminApi.getProducts().subscribe((data: any) => {
      this.products = data.products;
      this.product_count = this.products.length;
    })
  }

  productTypeCount() {
    this.adminApi.getProductTypes().subscribe((data: any) => {
      this.product_type_count = data.product_types.length;
    })
  }

  testimonialCount() {
    this.adminApi.getTestimonials().subscribe((data: any) => {
      this.testimonial_count = data.data.length;
    })
  }

  blogCount() {
    this.adminApi.getBlogs().subscribe((data: any) => {
      this.blog_count = data.data.length;
    })
  }

  orders() {
    this.adminApi.getOrders().subscribe((data: any) => {
      this.orders = data.data;
      this.order_count = this.orders.length;
    })
  }

  subscribers() {
    this.adminApi.getSubscribers().subscribe((data: any) => {
      this.subscriber_count = data.data.length;
    })
  }

  team_Meambers() {
    this.adminApi.getTeamMembers().subscribe((data: any) => {;
      this.team_count = data.data.length;
    })
  }

  adminName: string = '';
  getloginAdmin() {
    this.adminApi.getAdminDetails()?.subscribe((data: any) => {
      if (data.success) {
        const adminDetails = data.admin;
        const firstName = adminDetails.admin_name.split(' ')[0];
        this.adminName = 'Welcome ' + firstName + ' !';
      }
    })
    setTimeout(() => {
      this.adminName = '';
    }, 2000);
  }

  userList: boolean = false;
  poster: boolean = true;
  updates: boolean = false;
  showUserList() {
    this.userList = true;
    this.poster = false;
    this.updates = false;
  }
  showPoster() {
    this.userList = false;
    this.poster = true;
  }

  user_detail: any;
  get_This_User(id: any) {
    this.adminApi.get_user(id).subscribe((user: any) => {
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

  wrongPass: any = ''
  formData: any =
    {
      user_id: '',
      user_name: '',
      user_email: '',
      user_password: '',
      confirm_password: '',
    }
  updateUser() {
    const formData = new FormData();

    if (this.formData.user_password != this.formData.confirm_password) {
      this.wrongPass = 'Passwords do not match.!!';
      return;
    }
    const id = this.formData.user_id;
    formData.append('user_name', this.formData.user_name);
    formData.append('user_email', this.formData.user_email);
    formData.append('user_mobile', this.formData.user_mobile);
    formData.append('user_password', this.formData.user_password);

    this.adminApi.updateUser(id, formData).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.message, 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
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
      else {
        this.toastr.success(data.error, 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
    setTimeout(() => {
      this.wrongPass = '';
    }, 3000);
  }

  delete_This_User(id: any) {
    this.adminApi.deleteUser(id).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.message, 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getData();
      }
      else {
        this.toastr.success(data.error, 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }


}
