import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  products: any[] = [];
  totalPrice: number = 0;

  constructor(public userApi: UserApiService, public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCartProducts();
  }

  getCartProducts() {
    this.userApi.getCartItems().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.products = res.products;
          this.calculateTotalPrice();
        } else {
          this.toastr.warning('No products found in the cart', 'Warning' , { disableTimeOut: false, progressBar:true ,closeButton : true });
          this.products = [];
        }
      });
  }

  calculateTotalPrice()
  {
    this.totalPrice = this.products.reduce((sum, product) => sum + product.product_price * product.qty, 0);
  }


  increaseQty(cartId: number) {
    this.userApi.updateCartQuantity(cartId, 'increase').subscribe((res: any) => {
        this.getCartProducts();
      });
  }

  decreaseQty(cartId: number) {
    this.userApi.updateCartQuantity(cartId, 'decrease').subscribe(
      (res: any) => {
        this.getCartProducts();
      });
  }

  removeProduct(cartId: number)
  {
    this.userApi.removeCartItem(cartId).subscribe(
      (res: any) => {
        if (res.status ==='success') {
          this.getCartProducts();
          this.toastr.success('Product removed from cart', 'success', { disableTimeOut: false, progressBar:true , closeButton: true });
        } else {
          this.toastr.error('Failed to remove product from cart', 'error', { disableTimeOut: false, progressBar:true ,closeButton: true });
        }
      });
  }
  

}
