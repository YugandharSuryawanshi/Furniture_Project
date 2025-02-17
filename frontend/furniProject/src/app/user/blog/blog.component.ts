import { Component } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  constructor(private userApi:UserApiService, private toastr:ToastrService){}
    
      ngOnInit() {
        this.getHomeData();
      }
      products: any[] = []; // Array to hold all product data
      productImages: any[] = []; // Array to store product images
      testimonial: any[] = [];
      blogs: any[] = [];
      team: any[] = [];
    
      getHomeData() {
        this.userApi.gethomeData().subscribe((res: any) => {
          // Process product Store data
          this.products = res.products;
          this.products.forEach((product) => {
            const images = product.product_image.split(","); // split product image
            const img = images.find((image: string) => image.trim() !== "") || ""; //for get first image
            product.firstImage = `http://localhost:1000/uploads/${img}`; // Append the image
          });
          this.testimonial = res.testimonial;
    
          this.blogs = res.blogs;
          this.team = res.team;
    
        })
      }

}
