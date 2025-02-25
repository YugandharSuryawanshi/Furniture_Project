import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private inactivityTimeout: any;
  private logoutTime = 2 * 60 * 60 * 1000; // 2 hours = 2 * 60 minutes * 60 seconds * 1000 milliseconds

  constructor(public userApi: UserApiService, public router: Router, public toastr: ToastrService) {
    this.resetTimer();
  }
  

  // Detect user activity (mouse, keyboard, click)
  @HostListener('window:mousemove') onMouseMove() { this.resetTimer(); }
  @HostListener('window:keypress') onKeyPress() { this.resetTimer(); }
  @HostListener('window:click') onClick() { this.resetTimer(); }

  resetTimer() {
    clearTimeout(this.inactivityTimeout);// clear timeout when any activity is happen
    this.inactivityTimeout = setTimeout(() => {
      this.autoLogout();
    }, this.logoutTime);
  }

  autoLogout() {
    this.userApi.userLogout();
    alert('Logged out Due to Inactivity timeout..! , Login Again!');
    this.toastr.warning('You have been logged out due to inactivity', "Session Expired", { disableTimeOut: false, progressBar:true ,closeButton: true });
    this.router.navigate(['/user/login']);
  }

  ngOnInit() {
    this.getHomeData();
  }
  banner_info: any = [];
  banner_image: any;
  products: any[] = []; // Array to hold all product data
  productImages: any[] = []; // Array to store product images
  about: any = [];
  about_image: any;
  about_points: any = [];
  interior: any = [];
  testimonial: any[] = [];
  blogs: any[] = [];
  customer_image: any = [];

  getHomeData() {
    this.userApi.gethomeData().subscribe((res: any) => {
      this.banner_info = res.banner_info[0];
      this.banner_image = `http://localhost:1000/uploads/${this.banner_info.banner_image}`;
      // Process product Store data
      this.products = res.products;
      this.products.forEach((product) => {
        const images = product.product_image.split(","); // split product image
        const img = images.find((image: string) => image.trim() !== "") || ""; //for get first image
        product.firstImage = `http://localhost:1000/uploads/${img}`; // Append the image
      });

      // Process about data
      this.about = res.about[0];
      this.about_image = `http://localhost:1000/uploads/${this.about.why_choose_img}`;
      this.about_points = res.about_points;

      this.interior = res.interior;
      this.testimonial = res.testimonial;

      for (let i = 0; i < this.testimonial.length; i++) {
        this.customer_image.push(`http://localhost:1000/uploads/` + this.testimonial[i].customer_image);

      }

      this.blogs = res.blog;
    })
  }

}
