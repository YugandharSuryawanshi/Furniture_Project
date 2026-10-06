import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private tokenKey = 'userToken';

  // Production URL
  // private userUrl = 'https://furniture-backend-ssa5.onrender.com';

  // Development URL
  // private userUrl = 'http://localhost:4000';
  private userUrl = environment.apiUrl; // Use the environment variable for the API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  // ==================================================
  // AUTHENTICATION
  // ==================================================

  // Register User
  register(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register`, data);
  }

  // User Login
  userLogin(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, data);
  }

  // Forgot Password
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/reset-password`, data);
  }

  // Send OTP
  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/send-otp`, data);
  }

  // Verify OTP
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/verify-otp`, data);
  }

  // Registration OTP Send
  registerSendOtp(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register-send-otp`, data);
  }

  // Registration OTP Verify
  registerVerifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register-verify-otp`, data);
  }


  // ==================================================
  // TOKEN MANAGEMENT
  // ==================================================

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get Token
  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  // Save Token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Clear Token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }


  // ==================================================
  // PROTECTED USER APIs
  // Authorization header is now handled
  // automatically by authInterceptor
  // ==================================================

  // Get Protected Data
  getProtectedData(): Observable<any> {
    return this.http.get(`${this.userUrl}/userProtected`);
  }

  // Protect Routes
  protectRoute(): boolean {

    const token = this.getToken();

    if (!token) {
      this.router.navigate(['/user/login']);
      return false;
    }

    return true;
  }


  // ==================================================
  // LOGOUT
  // ==================================================

  userLogout(): void {

    this.http.post(`${this.userUrl}/userLogout`, {}).subscribe({

      next: () => {

        this.clearToken();

        this.router.navigate(['/user/login']);

      },

      error: () => {

        // Even if backend logout fails,
        // remove local authentication.

        this.clearToken();

        this.router.navigate(['/user/login']);

      }

    });
  }


  // ==================================================
  // USER PROFILE
  // ==================================================

  // Get logged-in user details
  getUserDetails(): Observable<any> {
    return this.http.get(`${this.userUrl}/userDetails`);
  }

  // Update user details
  updateUserDetails(formData: FormData): Observable<any> {
    return this.http.put(
      `${this.userUrl}/userUpdate`,
      formData
    );
  }

  // Update user profile
  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.put(
      `${this.userUrl}/userUpdateProfile`,
      formData
    );
  }

  // Update password
  updatePassword(formData: any): Observable<any> {
    return this.http.put(
      `${this.userUrl}/userUpdatePassword`,
      formData
    );
  }


  // ==================================================
  // HOME / PRODUCTS
  // ==================================================

  // Get Home Page Data
  gethomeData(): Observable<any> {
    return this.http.get(`${this.userUrl}/home`);
  }

  // Get Products
  getProducts(page: number): Observable<any> {
    return this.http.get(
      `${this.userUrl}/products?page=${page}`
    );
  }

  // Get Product Details
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.userUrl}/product?id=${id}`
    );
  }


  // ==================================================
  // REVIEWS
  // ==================================================

  // Add Review
  addReview(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.userUrl}/save_review`,
      formData
    );
  }

  // Get Reviews
  getReviews(productId: any): Observable<any> {
    return this.http.get(
      `${this.userUrl}/get_reviews/${productId}`
    );
  }


  // ==================================================
  // CART
  // ==================================================

  // Add to Cart
  addToCart(productId: any): Observable<any> {
    return this.http.post(
      `${this.userUrl}/add_to_cart`,
      {
        product_id: productId
      }
    );
  }

  // Cart Status
  getCartStatus(productId: any): Observable<any> {
    return this.http.get(
      `${this.userUrl}/get_cart_status/${productId}`
    );
  }

  // Get Cart Items
  getCartItems(): Observable<any> {
    return this.http.get(
      `${this.userUrl}/get_cart_items`
    );
  }

  // Update Cart Quantity
  updateCartQuantity(
    cartId: number,
    action: string
  ): Observable<any> {

    return this.http.post(
      `${this.userUrl}/update_cart_quantity`,
      {
        cartId,
        action
      }
    );
  }

  // Remove Cart Item
  removeCartItem(cartId: number): Observable<any> {

    return this.http.delete(
      `${this.userUrl}/remove_from_cart/${cartId}`
    );
  }


  // ==================================================
  // CHECKOUT
  // ==================================================

  // Get User Information
  getUserInfo(): Observable<any> {
    return this.http.get(
      `${this.userUrl}/user_info`
    );
  }

  // Clear Cart
  clearCart(): Observable<any> {
    return this.http.delete(
      `${this.userUrl}/clear_cart`
    );
  }


  // ==================================================
  // ORDERS
  // ==================================================

  // Get My Orders
  getMyOrders(): Observable<any> {
    return this.http.get(
      `${this.userUrl}/my_orders`
    );
  }

  // Track Order
  getOrderTracking(orderId: number): Observable<any> {

    return this.http.get(
      `${this.userUrl}/track_order/${orderId}`
    ).pipe(

      catchError(error => {

        console.error(
          'Error tracking order:',
          error
        );

        return throwError(() => error);

      })

    );
  }

  // Cancel Order
  cancelOrder(orderId: number): Observable<any> {

    return this.http.post(
      `${this.userUrl}/cancel_order/${orderId}`,
      {}
    ).pipe(

      catchError(error => {

        console.error(
          'Error canceling order:',
          error
        );

        return throwError(() => error);

      })

    );
  }

  // Get Order Receipt
  getOrderReceipt(orderId: number): Observable<any> {

    return this.http.get(
      `${this.userUrl}/get_order_receipt/${orderId}`
    ).pipe(

      catchError(error => {

        console.error(
          'Error fetching receipt:',
          error
        );

        return throwError(() => error);

      })

    );
  }


  // ==================================================
  // CONTACT / SUBSCRIPTION
  // ==================================================

  // Contact Us
  addContactUsInfo(formData: any): Observable<any> {
    return this.http.post(
      `${this.userUrl}/contact_us`,
      formData
    );
  }

  // Subscriber
  addSubscriber(formData: any): Observable<any> {
    return this.http.post(
      `${this.userUrl}/subscribe`,
      formData
    );
  }


  // ==================================================
  // WISHLIST
  // ==================================================

  // Add Product to Wishlist
  addToWishlist(productId: any): Observable<any> {

    return this.http.post(
      `${this.userUrl}/add_to_wishlist`,
      {
        product_id: productId
      }
    );
  }

  // Get Wishlist
  getWishlist(): Observable<any> {
    return this.http.get(
      `${this.userUrl}/get_wishlist`
    );
  }

  // Move All Wishlist Products to Cart
  moveAllToCart(): Observable<any> {

    return this.http.post(
      `${this.userUrl}/move_to_cart`,
      {}
    );
  }

  // Remove Wishlist Product
  removeFromWishlist(productId: any): Observable<any> {

    return this.http.delete(
      `${this.userUrl}/remove_from_wishlist/${productId}`
    );
  }

  // Wishlist Status
  getWishlistStatus(productId: any): Observable<any> {

    return this.http.get(
      `${this.userUrl}/get_wishlist_status/${productId}`
    );
  }

  // Add Single Wishlist Product to Cart
  addToCartFromWishlist(
    productId: number
  ): Observable<any> {

    return this.http.post(
      `${this.userUrl}/add_to_cart_single`,
      {
        product_id: productId
      }
    );
  }


  // ==================================================
  // MOST VIEWED
  // ==================================================

  getMostViewedProducts(
    limit: number
  ): Observable<any> {

    return this.http.get(
      `${this.userUrl}/most_viewed?limit=${limit}`
    );
  }

}