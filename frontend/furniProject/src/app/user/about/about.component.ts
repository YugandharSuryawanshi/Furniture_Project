import { Component } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  constructor(private userApi:UserApiService, private toastr:ToastrService){}

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
  team: any[] = [];

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
      this.team = res.team;

    })
  }

  showmsg()
  {
    this.toastr.warning('This feature we will Add Soon..', 'Wait', {disableTimeOut: false, progressBar: true, closeButton: true  });
  }

}
