import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  readonly IMAGE_BASE_URL = 'https://furniture-backend-ssa5.onrender.com/uploads/';

  private inactivityTimeout: any;
  private logoutTime = 2 * 60 * 60 * 1000;

  constructor(
    public userApi: UserApiService,
    public router: Router,
    public toastr: ToastrService,
    public imageService: ImageService
  ) {
    this.resetTimer();
  }

  @HostListener('window:mousemove') onMouseMove() { this.resetTimer(); }
  @HostListener('window:keypress') onKeyPress() { this.resetTimer(); }
  @HostListener('window:click') onClick() { this.resetTimer(); }

  // Timer Reset
  resetTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => this.autoLogout(), this.logoutTime);
  }

  // Auto Logout
  autoLogout() {
    this.userApi.userLogout();
    this.toastr.warning('Session Expired', 'You have been logged out', {
      disableTimeOut: false,
      progressBar: true,
      closeButton: true
    });
    this.router.navigate(['/user/login']);
  }

  ngOnInit() {
    this.getHomeData();
  }

  banner_info: any = [];
  banner_image: any;
  products: any[] = [];
  about: any = [];
  about_image: any;
  about_points: any = [];
  interior: any = [];
  testimonial: any[] = [];
  blogs: any[] = [];
  customer_image: any[] = [];

  getHomeData() {
    this.userApi.gethomeData().subscribe((res: any) => {

      this.banner_info = res.banner_info[0];
      this.banner_image = this.imageService.getImageUrl(
        this.banner_info.banner_image
      );

      this.products = res.products;

      this.products.forEach((product) => {
        const images = product.product_image.split(",");
        const img = images.find((i: string) => i.trim() !== "") || "";

        product.firstImage = this.imageService.getImageUrl(img);
      });

      this.about = res.about[0];
      this.about_image = this.imageService.getImageUrl(
        this.about.why_choose_img
      );

      this.about_points = res.about_points;

      this.about_points.forEach((point: any) => {
        point.imageUrl = this.imageService.getImageUrl(
          point.why_choose_points_img
        );
      });

      this.interior = res.interior;

      if (this.interior.length > 0) {
        this.interior[0].firstImageUrl = this.imageService.getImageUrl(
          this.interior[0].first_image
        );

        this.interior[0].secondImageUrl = this.imageService.getImageUrl(
          this.interior[0].second_image
        );

        this.interior[0].thirdImageUrl = this.imageService.getImageUrl(
          this.interior[0].third_image
        );
      }

      this.testimonial = res.testimonial;

      this.testimonial.forEach((item: any) => {
        item.imageUrl = this.imageService.getImageUrl(
          item.customer_image
        );
      });

      this.blogs = res.blog;

      this.blogs.forEach((blog: any) => {
        blog.imageUrl = this.imageService.getImageUrl(
          blog.blog_image
        );
      });
    });
  }
}