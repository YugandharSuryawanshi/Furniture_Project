import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserApiService } from '../../service/user-api.service';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent implements OnInit {

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    public imageUrl: ImageService
  ) { }

  ngOnInit(): void {
    this.getHomeData();
  }

  // Banner
  banner_info: any = {};
  banner_image: string = '';

  // Products
  products: any[] = [];

  // About
  about: any = {};
  about_image: string = '';
  about_points: any[] = [];

  // Interior
  interior: any[] = [];

  // Testimonials
  testimonial: any[] = [];

  // Blogs
  blogs: any[] = [];

  // Team
  team: any[] = [];

  // Load Home Data
  getHomeData(): void {

    this.userApi.gethomeData().subscribe({
      next: (res: any) => {

        // Banner
        this.banner_info = res?.banner_info?.[0] || {};

        this.banner_image = this.banner_info?.banner_image
          ? this.imageUrl.getImageUrl(this.banner_info.banner_image)
          : '';

        // Products

        this.products = res?.products || [];

        this.products.forEach(product => {

          if (product.product_image) {
            const images = product.product_image
              .split(',')
              .map((img: string) => img.trim())
              .filter((img: string) => img !== '');

            product.firstImage = images.length
              ? this.imageUrl.getImageUrl(images[0])
              : 'images/no-image.png';

          } else {
            product.firstImage = 'images/no-image.png';
          }
        });

        // About

        this.about = res?.about?.[0] || {};
        this.about_image = this.about?.why_choose_img
          ? this.imageUrl.getImageUrl(this.about.why_choose_img)
          : '';

        this.about_points = res?.about_points || [];

        // Testimonials

        this.testimonial = res.testimonial;

        this.testimonial.forEach((item: any) => {
          item.imageUrl = this.imageUrl.getImageUrl(
            item.customer_image
          );
        });

        // Interior

        this.interior = res?.interior || [];

        // Blogs

        this.blogs = res?.blog || [];

        // Team

        this.team = res?.team || [];

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err?.error?.message || 'Unable to load services.',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );

      }

    });

  }

}