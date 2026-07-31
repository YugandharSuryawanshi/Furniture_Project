import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserApiService } from '../../service/user-api.service';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  latestProducts: any[] = [];
  wishlist: any[] = [];
  mostlyViewedProducts: any[] = [];

  count: number = 0;

  totalAmount: number = 0;
  savedAmount: number = 0;

  animatedTotal: number = 0;
  animatedSaved: number = 0;

  isProcessing: boolean = false;

  wishlistUrl: string = window.location.href;

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    public imageUrl: ImageService
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
    this.getProducts();
  }

  // Load Wishlist
  loadWishlist(): void {
    this.userApi.getWishlist().subscribe({

      next: (response: any) => {

        if (response?.success) {

          this.wishlist = response.data.map((item: any) => {

            const images = item.product_image ? item.product_image.split(',')
              .map((img: string) => this.imageUrl.getImageUrl(img.trim()))
              : ['images/no-image.png'];

            return {
              ...item,
              product_images: images
            };

          });

          this.count = this.wishlist.length;

          this.calculateTotals();

        } else {
          this.toastr.error('Failed to load wishlist', 'Error',
            {
              progressBar: true,
              closeButton: true
            }
          );

        }

      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Unable to load wishlist', 'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );

      }

    });

  }

  // Calculate Totals
  calculateTotals(): void {

    this.totalAmount = this.wishlist.reduce(
      (sum, item) => sum + Number(item.product_price || 0),
      0
    );

    this.savedAmount = this.wishlist.reduce(
      (sum, item) =>
        sum +
        (
          Number(item.duplicate_price || 0) -
          Number(item.product_price || 0)
        ),
      0
    );

    this.animateCount('total');
    this.animateCount('saved');

  }

  // Animated Counter
  animateCount(type: string): void {

    let start = 0;

    const end =
      type === 'total'
        ? this.totalAmount
        : this.savedAmount;

    const step = Math.max(1, Math.ceil(end / 50));

    const interval = setInterval(() => {

      if (start >= end) {

        start = end;

        clearInterval(interval);

      }

      if (type === 'total') {
        this.animatedTotal = start;
      } else {
        this.animatedSaved = start;
      }

      start += step;

    }, 40);

  }

  // Move All To Cart
  moveAllToCart(): void {

    if (this.wishlist.length === 0) {

      this.toastr.warning('Your wishlist is empty.', 'Warning',
        {
          progressBar: true,
          closeButton: true
        }
      );

      return;
    }

    this.isProcessing = true;

    this.userApi.moveAllToCart().subscribe({

      next: (res: any) => {

        this.toastr.success(res.message, 'Success');

        this.loadWishlist();

        this.isProcessing = false;
      },

      error: (err) => {

        console.error(err);

        this.isProcessing = false;

        this.toastr.error(
          'Failed to move items to cart',
          'Error',
          {
            progressBar: true,
            closeButton: true
          }
        );

      }

    });

  }

  // Share Wishlist

  shareViaGmail(): void {

    const subject = encodeURIComponent('Check out my wishlist!');

    const body = encodeURIComponent(
      `Hey,
      Take a look at my wishlist:
      ${this.wishlistUrl} Best Regards`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`, '_blank');
  }

  // Remove Wishlist Item
  removeFromWishlist(productId: number): void {

    this.userApi.removeFromWishlist(productId).subscribe({

      next: (response: any) => {

        if (response?.success) {

          this.toastr.success('Removed from wishlist', 'Success',
            {
              progressBar: true,
              closeButton: true
            }
          );

          this.loadWishlist();

        } else {
          this.toastr.error(
            'Error removing item',
            'Error'
          );

        }

      },

      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Something went wrong', 'Error');
      }

    });

  }

  // Add Single Product To Cart
  addToCart(product_id: number): void {

    this.userApi.addToCartFromWishlist(product_id).subscribe({
      next: (res: any) => {

        if (res?.success) {
          this.toastr.success('Product added to cart', 'Success',
            {
              progressBar: true,
              closeButton: true
            }
          );

          this.loadWishlist();
        } else {
          this.toastr.error('Failed to add product to cart', 'Error');
        }

      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Something went wrong', 'Error');
      }

    });

  }

  // Most Viewed Products
  getProducts(): void {
    this.userApi.getMostViewedProducts(6).subscribe({
      next: (res: any) => {

        if (res?.success) {

          this.latestProducts = res.data.map((item: any) => {

            let images: string[] = [];

            if (item.product_image) {

              images = item.product_image
                .split(',')
                .map((img: string) =>
                  this.imageUrl.getImageUrl(img.trim())
                );

            }

            return {
              ...item,
              product_images: images.length
                ? images
                : ['images/no-image.png']
            };

          });

        } else {

          this.toastr.error(
            'Failed to load products',
            'Error'
          );

        }

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err?.error?.message || 'Unable to load products',
          'Error'
        );

      }

    });

  }

  // Add To Wishlist
  AddToWishlist(product_id: number): void {
    this.userApi.addToWishlist(product_id).subscribe({
      next: (res: any) => {

        if (res?.success) {
          this.loadWishlist();
          this.toastr.success('Product added to wishlist', 'Success',
            {
              progressBar: true,
              closeButton: true
            }
          );
        } else {
          this.toastr.error('Failed to add product to wishlist', 'Error');
        }

      },

      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Something went wrong', 'Error');
      }

    });

  }

}