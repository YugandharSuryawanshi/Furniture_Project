import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';

import { UserApiService } from '../../service/user-api.service';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  products: any[] = [];

  totalPrice: number = 0;

  cartLoading: boolean = false;


  constructor(
    public userApi: UserApiService,
    public router: Router,
    public toastr: ToastrService,
    public imageService: ImageService
  ) { }


  ngOnInit(): void {

    /*
     * Only logged-in users need cart API.
     * Logged-out users already have a separate empty-cart UI.
     */
    if (this.userApi.isUserLoggedIn()) {
      this.getCartProducts();
    }

  }


  // =========================================================
  // GET CART PRODUCTS
  // =========================================================

  getCartProducts() {

    this.cartLoading = true;

    this.userApi.getCartItems()
      .pipe(

        /*
         * Empty cart should not be treated as a fatal page error.
         * If backend returns an error/no products, keep cart empty.
         */
        catchError((error: any) => {

          console.log('Cart is empty or cart data is unavailable:', error);

          this.products = [];
          this.totalPrice = 0;

          return of(null);

        }),

        finalize(() => {
          setTimeout(() => {
            this.cartLoading = false;
          }, 700);
        })

      )
      .subscribe((res: any) => {

        /*
         * If request returned no response because of empty cart/error,
         * simply show the empty-cart state.
         */
        if (!res) {

          this.products = [];
          this.totalPrice = 0;

          return;

        }


        if (res.status === 'success') {

          this.products = (res.products || []).map(
            (product: any) => ({

              ...product,

              firstImage:
                this.imageService.getImageUrl(
                  product.product_image?.split(',')[0]
                )

            })
          );

          this.calculateTotalPrice();

        }
        else {

          /*
           * Empty cart is a normal state.
           * Do NOT show toastr warning here.
           */
          this.products = [];

          this.totalPrice = 0;

        }

      });

  }


  // =========================================================
  // CALCULATE TOTAL PRICE
  // =========================================================

  calculateTotalPrice() {

    this.totalPrice = this.products.reduce(
      (sum, product) =>
        sum +
        Number(product.product_price) *
        Number(product.qty),
      0
    );

  }


  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  increaseQty(cartId: number) {

    this.userApi
      .updateCartQuantity(cartId, 'increase')
      .subscribe(() => {

        this.getCartProducts();

      });

  }


  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  decreaseQty(cartId: number) {

    this.userApi
      .updateCartQuantity(cartId, 'decrease')
      .subscribe(() => {

        this.getCartProducts();

      });

  }


  // =========================================================
  // REMOVE PRODUCT
  // =========================================================

  removeProduct(cartId: number) {

    this.userApi
      .removeCartItem(cartId)
      .subscribe((res: any) => {

        if (res.status === 'success') {

          this.getCartProducts();

          this.toastr.success(
            'Product removed from cart',
            'Success',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

        }
        else {

          this.toastr.error(
            'Failed to remove product from cart',
            'Error',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

        }

      });

  }

}