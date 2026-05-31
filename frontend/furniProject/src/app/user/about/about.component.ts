import { Component } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    public imageService: ImageService
  ) { }

  ngOnInit() {
    this.getHomeData();
  }

  banner_info: any = [];
  banner_image: any;

  products: any[] = [];
  productImages: any[] = [];

  about: any = [];
  about_image: any;
  about_points: any = [];

  interior: any = [];
  testimonial: any[] = [];

  blogs: any[] = [];
  customer_image: any[] = [];

  team: any[] = [];

  getHomeData() {

    this.userApi.gethomeData().subscribe((res: any) => {

      this.banner_info = res.banner_info[0];

      this.banner_image = this.imageService.getImageUrl(
        this.banner_info.banner_image
      );

      this.products = res.products;

      this.products.forEach((product) => {
        const images = product.product_image.split(",");
        const img = images.find(
          (image: string) => image.trim() !== ""
        ) || "";

        product.firstImage = this.imageService.getImageUrl(img);
      });

      this.about = res.about[0];

      this.about_image = this.imageService.getImageUrl(this.about.why_choose_img);

      this.about_points = res.about_points;

      this.about_points.forEach((point: any) => {
        point.imageUrl = this.imageService.getImageUrl(point.why_choose_points_img);
      });

      this.interior = res.interior;

      this.testimonial = res.testimonial;

      this.testimonial.forEach((item: any) => {
        item.imageUrl = this.imageService.getImageUrl(item.customer_image);
      });

      this.blogs = res.blog;

      this.team = res.team;

      this.team.forEach((member: any) => {
        member.imageUrl = this.imageService.getImageUrl(
          member.member_image
        );
      });

    });
  }

  showmsg() {
    this.toastr.warning('This feature we will Add Soon..', 'Wait',
      {
        disableTimeOut: false,
        progressBar: true,
        closeButton: true
      }
    );
  }

}