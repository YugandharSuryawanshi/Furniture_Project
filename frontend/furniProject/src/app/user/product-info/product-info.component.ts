import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {

  errorMessage: any = '';
  successMessage: any = '';
  came_product_id: any = '';
  rating: any = 4;
  product: any = {};
  product_details: any;
  additional_details: any;
  images: string[] = [];
  productDetailImages: string[] = [];
  selectedImage: string = '';
  product_price: any;
  discount: any = 0;
  showZoom: boolean = false;
  backgroundPosX: string = '0%';
  backgroundPosY: string = '0%';
  isDesktop: boolean = true; // Flag to check if the device is desktop
  reviewImages: any[] = [];
  check_is_login: any = this.userApi.isUserLoggedIn();
  addReview: any = false;
  topReviewsDisplay: any = true;
  isWishlistAdded:boolean = false;

  constructor(private route: ActivatedRoute, private userApi: UserApiService, public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.checkDeviceType(); // Check device on page load
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.came_product_id = id;
      this.fetchProductDetails(id);
      this.getReviews()
      this.getWishlistStatus(id);
    }
  }

  fetchProductDetails(id: string) {
    this.userApi.getProductById(id).subscribe((data: any) => {
      this.getCartStatus(id);
      this.product = data;
      this.product_details = this.product.product_details.replace(/\.\s*/g, ".<br>");
      this.additional_details = this.product.additional_details.replace(/\.\s*/g, ".<br>");

      this.product_price = Math.floor(Number(this.product.product_price));

      this.discount = ((this.product.duplicate_price - this.product.product_price) / this.product.duplicate_price) * 100;
      this.discount = parseFloat(this.discount.toFixed(2));

      if (this.product.product_image) {
        this.images = this.product.product_image.split(',');
        this.selectedImage = this.images[0];
      }
    });
  }

  changeImage(image: string): void {
    this.selectedImage = image;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDesktop) return; // Stop zoom preview on mobile screen

    const target = event.currentTarget as HTMLElement;
    const { width, height, left, top } = target.getBoundingClientRect();

    const x = ((event.pageX - left) / width) * 100;
    const y = ((event.pageY - top) / height) * 100;

    this.backgroundPosX = `${x}%`;
    this.backgroundPosY = `${y}%`;
  }

  @HostListener('window:resize', ['$event']) // Detect window resize
  checkDeviceType(): void {
    this.isDesktop = window.innerWidth > 768; // Check if it's a desktop
    if (!this.isDesktop) {
      this.showZoom = false; // Disable zoom preview on mobile devices
    }
  }

  onMouseEnter(): void {
    if (this.isDesktop) {
      this.showZoom = true;
    }
  }

  onMouseLeave(): void {
    this.showZoom = false;
  }

  // Review Process Start
  formData = {
    rating: '',
    comment: '',
    country: '',
    heading: '',
    product_id: '',
  };

  selectedImages: File[] = []; // Array to store multiple images

  // Handle file selection
  getImages(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedImages = Array.from(fileInput.files);
    }
  }

  saveReview() {
    const formData = new FormData();
    formData.append('rating', this.formData.rating);
    formData.append('comment', this.formData.comment);
    formData.append('country', this.formData.country);
    formData.append('product_id', this.came_product_id);
    formData.append('heading', this.formData.heading);

    // Append all selected images
    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach((image) => {
        formData.append('review_img', image);
      });
    }

    if (this.formData.rating && this.formData.comment && this.formData.country) {
      this.userApi.addReview(formData).subscribe((res: any) => {
        if (res.status === 'success') {
          this.formData.rating = '',
            this.formData.comment = '',
            this.formData.country = '',
            this.selectedImages = [],
            this.addReview = false,
            this.getReviews();
          this.toastr.success('Review Added successfully', 'Success', { disableTimeOut: false, progressBar: true, closeButton: true });
        }
        else {
          this.toastr.error(res.message, 'Error', { disableTimeOut: false, progressBar: true, closeButton: true });
        }
      });
    } else {
      this.toastr.error(
        'Please fill all fields',
        'Error',
        { disableTimeOut: false, progressBar: true, closeButton: true });
    }
  }

  topReviews: any[] = [];
  allReviews: any[] = [];

  getReviews() {
    this.userApi.getReviews(this.came_product_id).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.topReviews = res.topReviews.map((review: any) => ({
            ...review,
            reviewImages: review.review_img ? review.review_img.split(',') : []
          }));

          this.allReviews = res.allReviews.map((review: any) => ({
            ...review,
            reviewImages: review.review_img ? review.review_img.split(',') : []
          }));
        }
      });
  }

  // Review button and form Toggle
  showReviewForm() {
    this.addReview = !this.addReview;
  }
  showAllReviews() {
    var isloginCheck = this.userApi.isUserLoggedIn();
    if (isloginCheck) {
      this.topReviewsDisplay = !this.topReviewsDisplay;
    }
    else {
      const userConfirmed = window.confirm("Please login to view all reviews");
      if (userConfirmed) {
        this.router.navigate(['/user/login']);
      }
    }
  }

  // Add to Cart Start Here
  gotocart: boolean = false;

  addToCart(product_id: any) {
    // Check user is logged in before adding to cart
    const isloginCheck = this.userApi.isUserLoggedIn();
    if (isloginCheck) {
      this.userApi.addToCart(product_id).subscribe(
        (res: any) => {
          if (res.isProductAdded === true) {
            this.gotocart = true;
          }
          else if (res.status === 'success') {
            this.toastr.success("Product added to cart successfully", "Success", { disableTimeOut: false, progressBar: true, closeButton: true });
            this.gotocart = true;
          }
          else {
            this.toastr.error(res.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
          }
        });
    }
    else {
      const userConfirmed = window.confirm("Please login to add product to cart");
      if (userConfirmed) {
        this.router.navigate(['/user/login']);
      }
    }
  }

  getCartStatus(product_id: any) {
    this.userApi.getCartStatus(product_id).subscribe((res: any) => {
      if (res.isProductAdded === true) {
        this.gotocart = true;
      } else {
        this.gotocart = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
    return initials;
  }

  // Add TO wishlist
  addToWishlist(product_id: any) {
    const isloginCheck = this.userApi.isUserLoggedIn();
    if (isloginCheck) {
      this.userApi.addToWishlist(product_id).subscribe(
        (res: any) => {
          if (res.success) {
            this.toastr.success( res.message , "Success", { disableTimeOut: false, progressBar: true, closeButton: true });
            this.isWishlistAdded = true;
            this.getWishlistStatus(product_id);
          }
          else {
            this.toastr.error(res.message, "Error", { disableTimeOut: false, progressBar: true, closeButton: true });
          }
        });
    }
    else {
      const userConfirmed = window.confirm("Please login to add product to wishlist");
      if (userConfirmed) {
        this.router.navigate(['/user/login']);
      }
    }
  }

  // Get wishlist status for current product_id
  getWishlistStatus(product_id: any) {
    this.userApi.getWishlistStatus(product_id).subscribe((res: any) => {
      if (res.success) {
        this.isWishlistAdded = res.isInWishlist;
      } else {
        console.log("Error fetching wishlist status:", res.message);
      }
    },
    (error) => {
      console.error("Error:", error);
    });
}

}