import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  imageBaseUrl: string = 'http://localhost:1000/uploads/';  // Base URL for images
  latestProducts: any[] = [];
  wishlist: any[] = [];
  mostlyViewedProducts: any[] = [];
  count: number = 0;
  totalAmount: number = 0;
  savedAmount: number = 0;
  animatedTotal: number = 0;
  animatedSaved: number = 0;
  isProcessing: boolean = false;
  wishlistUrl: string = window.location.href; // Current page URL

  constructor(private userApi: UserApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadWishlist();
    this.getProducts();
  }

  // Load Wishlist Items
  loadWishlist() {
    this.userApi.getWishlist().subscribe(response => {
      if (response.success) {
        this.wishlist = response.data.map((item: any) => ({
          ...item,
          product_images: item.product_image
            ? item.product_image.split(',').map((img: string) => this.imageBaseUrl + img)
            : ['https://placehold.co/300x300?text=No+Image']

        }));
        this.count = this.wishlist.length;
        this.calculateTotals();
      } else {
        this.toastr.error('Failed to load wishlist', 'Error');
      }
    });
  }

  calculateTotals(): void {
    this.totalAmount = this.wishlist.reduce((sum, item) => sum + parseFloat(item.product_price), 0);
    this.savedAmount = this.wishlist.reduce(
      (sum, item) => sum + (parseFloat(item.duplicate_price) - parseFloat(item.product_price)), 0);
    this.animateCount('total');
    this.animateCount('saved');
  }

  animateCount(type: string): void {
    let start = 1;
    let end = type === 'total' ? this.totalAmount : this.savedAmount;
    let step = Math.ceil(end / 50); // Control speed

    let interval = setInterval(() => {
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
    }, 40); // Adjust speed of counting
  }

  moveAllToCart(): void {
    if (this.wishlist.length === 0) {
      this.toastr.warning("Your wishlist is empty.", 'Warning', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
      return;
    }

    this.isProcessing = true;
    this.userApi.moveAllToCart().subscribe(
      (res: any) => {
        this.toastr.success(res.message, 'Success');
        this.loadWishlist(); // Reload wishlist to reflect changes
        this.isProcessing = false;
      },
      error => {
        this.toastr.error("Failed to move items to cart", 'Error', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
        this.isProcessing = false;
      }
    );
  }

  //Share Wishlist Through Gmail
  shareViaGmail() {
    // Prepare email content
    const subject = encodeURIComponent("Check out my wishlist!");
    const body = encodeURIComponent(`Hey,\n\nTake a look at my wishlist: ${this.wishlistUrl}\n\nBest,\n[Your Name],\n\n\nWebsite Funi Store \nCreated by Yugandhar Suryawanshi`);

    // Open Gmail in a new tab
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`, '_blank');
  }

  // Remove Item from Wishlist
  removeFromWishlist(productId: number) {
    this.userApi.removeFromWishlist(productId).subscribe(response => {
      if (response.success) {
        this.toastr.success('Removed from wishlist', 'Success', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
        this.loadWishlist();
      } else {
        this.toastr.error('Error removing item from wishlist', 'Error');
      }
    }, error => {
      console.error('Error:', error);
      this.toastr.error('Something went wrong', 'Error');
    });
  }

  // Add to Cart Single Product
  addToCart(product_id: any) {
    console.log('product_id:', product_id);
    this.userApi.addToCartFromWishlist(product_id).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Product added to cart', 'Success', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
      } else {
        this.toastr.error('Failed to add product to cart', 'Error', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
      }
    })

  }


  getProducts() {
    this.userApi.getMostViewedProducts(6).subscribe((res: any) => {
      if (res.success) {
        console.log('Product Data:', res.data);

        this.latestProducts = res.data.map((item: any) => ({
          ...item,
          product_images: item.product_image.length
            ? item.product_image.map((img: string) => this.imageBaseUrl + img)
            : ['https://placehold.co/300x300?text=No+Image']
        }));

        console.log('Latest Products:', this.latestProducts);
      } else {
        this.toastr.error('Failed to load latest products', 'Error');
      }
    });
  }

  AddToWishlist(product_id: any) {
    this.userApi.addToWishlist(product_id).subscribe((res: any) => {
      if (res.success) {
        this.loadWishlist()
        this.toastr.success('Product added to wishlist', 'Success', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
      } else {
        this.toastr.error('Failed to add product to wishlist', 'Error', { disableTimeOut: false, closeButton: true, tapToDismiss: true, progressBar: true });
      }
    })
  }




}
