import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , RouterLink ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  products: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(private userApi:UserApiService ) { }

  ngOnInit(): void {
    // Fetch the products for the current page
    this.fetchProducts(this.currentPage);
  }
// 
  fetchProducts(page: number): void {
    this.userApi.getProducts(page).subscribe((data: any) => {
      this.products = data.products;
      this.totalPages = data.totalPages;
      this.currentPage = page;
    });
  }

}
