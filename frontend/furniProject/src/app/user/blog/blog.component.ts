import { Component } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    public imageService: ImageService
  ) { }

  ngOnInit() {
    this.getHomeData();
  }

  products: any[] = [];
  productImages: any[] = [];

  testimonial: any[] = [];
  blogs: any[] = [];
  team: any[] = [];

  getHomeData() {

    this.userApi.gethomeData().subscribe((res: any) => {

      this.products = res.products;

      this.products.forEach((product) => {

        const images = product.product_image.split(",");

        const img =
          images.find((image: string) => image.trim() !== "") || "";

        product.firstImage =
          this.imageService.getImageUrl(img);

      });

      this.testimonial = res.testimonial;

      this.testimonial.forEach((item: any) => {

        item.imageUrl =
          this.imageService.getImageUrl(
            item.customer_image
          );

      });

      this.blogs = res.blogs || res.blog;

      this.blogs.forEach((blog: any) => {

        blog.imageUrl =
          this.imageService.getImageUrl(
            blog.blog_image
          );

      });

      this.team = res.team;

    });

  }

}