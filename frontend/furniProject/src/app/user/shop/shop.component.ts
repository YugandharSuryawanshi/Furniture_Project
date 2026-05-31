import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { UserApiService } from '../../service/user-api.service';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  products: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    private userApi: UserApiService,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.fetchProducts(this.currentPage);
  }

  fetchProducts(page: number): void {

    this.userApi.getProducts(page).subscribe((data: any) => {

      this.products = data.products.map((product: any) => {

        const firstImage = product.product_image?.split(',')[0]?.trim() || '';

        return {
          ...product,
          firstImageUrl:
            this.imageService.getImageUrl(firstImage)
        };

      });

      this.totalPages = data.totalPages;
      this.currentPage = page;
    });
  }

}