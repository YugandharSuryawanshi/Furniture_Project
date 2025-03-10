import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private tokenKey = 'userToken';  // Local storage key to store JWT token
  private userUrl = 'http://localhost:1000';
  constructor(private http: HttpClient, private router: Router) { }

  //Register Route
  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.userUrl}/register`, formData)
  }

  // User Login
  userLogin(formData: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, formData);
  }

  // Check if the user is logged in
  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get Token from LocalStorage
  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  // Save Token to LocalStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Clear Token from LocalStorage
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Get Protected Data by sending the token in Authorization header
  getProtectedData(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get('http://localhost:1000/userProtected', { headers });
  }

  // Protect Routes by checking if the token exists
  protectRoute(): boolean {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/user/login']);
      return false;
    }
    return true;
  }

  // Logout User
  userLogout() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:1000/userLogout', {}, { headers }).subscribe({
      next: () => {
        this.clearToken();
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/user/login']);
      },
      error: (err) => {
        this.clearToken();
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/user/login']);
      }
    })
  }

  // getting logged in user Details
  getUserDetails() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userUrl}/userDetails`, { headers });
  }

  // Update user details
  updateUserDetails(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.userUrl}/userUpdate`, formData, { headers });
  }

  //Update User Profile Only
  updateUserProfile(formData: FormData): Observable<any> {
    const token = this.getToken(); // Get the JWT token for authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.userUrl}/userUpdateProfile`, formData, { headers });
  }

  // Update Password Only
  updatePassword(formData: any): Observable<any> {
    const token = this.getToken(); // Get the JWT token for authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.userUrl}/userUpdatePassword`, formData, { headers });
  }

  //Get All Home Page Data
  gethomeData() {
    return this.http.get(`${this.userUrl}/home`);
  }

  //Get Products Page
  getProducts(page: number) {
    return this.http.get(`${this.userUrl}/products?page=${page}`);
  }

  //Get Product Details By Product ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/product?id=${id}`); // Matches backend endpoint
  }

  //Add Review
  addReview(formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.userUrl}/save_review`, formData, { headers });
  }

  //Get Reviews
  getReviews(productId: any) {
    return this.http.get(`${this.userUrl}/get_reviews/${productId}`);
  }

  //Add to Cart
  addToCart(productId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.userUrl}/add_to_cart`, { product_id: productId }, { headers });
  }

  //Get product status is added to cart or not
  getCartStatus(productId: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userUrl}/get_cart_status/${productId}`, { headers });
  }

  //Get Cart Items
  getCartItems(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userUrl}/get_cart_items`, { headers });
  }

  //Update Cart Item quantity
  updateCartQuantity(cartId: number, action: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.userUrl}/update_cart_quantity`, { cartId, action }, { headers });
  }

  //Delete a cart Item
  removeCartItem(cartId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.userUrl}/remove_from_cart/${cartId}`, { headers });
  }

  // Getting user Information for checkout page
  getUserInfo() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userUrl}/user_info`, { headers });
  }

  // Delete a user from the cart for empty/ remove cart items
  clearCart() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.userUrl}/clear_cart`, { headers });
  }

  //Get my orders
  getMyOrders(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userUrl}/my_orders`, { headers });
  }

  //Get Order Status Due to tracking order
  getOrderTracking(orderId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.userUrl}/track_order/${orderId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error tracking order:', error);
        return throwError(() => error);
      })
    );
  }

  // Cancel Order Change Status
  cancelOrder(orderId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.userUrl}/cancel_order/${orderId}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Error canceling order:', error);
        return throwError(() => error);
      })
    );
  }

  //Get Order Receipt Details
  getOrderReceipt(orderId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.userUrl}/get_order_receipt/${orderId}`, { headers }).pipe(
        catchError(error => {
            console.error('Error fetching receipt:', error);
            return throwError(() => error);
        })
    );
  }

  //Add Contact Us Info
  addContactUsInfo(formData: any): Observable<any> {
    return this.http.post(`${this.userUrl}/contact_us`, formData);
  }



}
