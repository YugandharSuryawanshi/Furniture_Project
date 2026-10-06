import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  private tokenKey = 'adminToken';

  // Production URL
  // private adminUrl = 'https://furniture-backend-ssa5.onrender.com/admin';

  // Development URL
  // private adminUrl = 'http://localhost:4000/admin';
  private adminUrl = environment.apiUrl + '/admin'; // Use the environment variable for the API URL


  private adminState = new BehaviorSubject<any>(null);

  adminState$ = this.adminState.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  // ==================================================
  // USER MANAGEMENT
  // ==================================================

  get_users() {
    return this.http.get(`${this.adminUrl}/get_users`);
  }

  get_user(id: any) {
    return this.http.get(
      `${this.adminUrl}/get_user/${id}`
    );
  }

  updateUser(id: any, formData: FormData) {
    return this.http.put(
      `${this.adminUrl}/update_user/${id}`,
      formData
    );
  }

  deleteUser(id: any) {
    return this.http.delete(
      `${this.adminUrl}/delete_user/${id}`
    );
  }


  // ==================================================
  // ADMIN AUTHENTICATION
  // ==================================================

  adminRegister(admin: {
    admin_name: string;
    admin_mobile: any;
    admin_email: any;
    admin_password: string;
  }): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/adminRegister`,
      admin
    );
  }

  adminLogin(admin: {
    admin_email: any;
    admin_password: any;
    otp: any;
  }): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/adminLogin`,
      admin
    );
  }

  verifyAdminPassword(admin: {
    admin_email: any;
    admin_password: any;
  }): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/verifyAdminPass`,
      admin
    );
  }

  resetPassword(
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/reset-password`,
      {
        email,
        password
      }
    );
  }


  // ==================================================
  // ADMIN TOKEN
  // ==================================================

  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  setToken(token: string): void {

    localStorage.setItem(
      this.tokenKey,
      token
    );

    this.fetchAdminDetails();
  }

  clearToken(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    this.adminState.next(null);
  }


  // ==================================================
  // ADMIN LOGOUT
  // ==================================================

  adminLogout(): void {

    this.http.post(
      `${this.adminUrl}/admin/adminLogout`,
      {}
    ).subscribe({

      next: () => {

        this.clearToken();

        this.router.navigate([
          '/admin/login'
        ]);

      },

      error: () => {

        this.clearToken();

        this.router.navigate([
          '/admin/login'
        ]);

      }

    });
  }


  // ==================================================
  // ADMIN PROFILE
  // ==================================================

  getAdminDetails() {

    return this.http.get(
      `${this.adminUrl}/admin_details`
    );
  }

  updateAdminDetails(
    formData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_admin`,
      formData
    );
  }

  updateAdminProfile(
    formData: FormData
  ): Observable<any> {

    return this.http.put(
      `${this.adminUrl}/update_admin_profile`,
      formData
    );
  }

  updatePassword(
    formData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_password`,
      formData
    );
  }


  // Fetch Admin Details
  fetchAdminDetails(): void {

    const token = this.getToken();

    if (!token) {
      return;
    }

    this.http.get(
      `${this.adminUrl}/admin_details`
    ).subscribe({

      next: (data: any) => {

        if (data.success) {

          this.adminState.next(
            data.admin
          );

        } else {

          this.adminState.next(null);

        }

      },

      error: (error) => {

        console.error(
          'Error fetching admin details:',
          error
        );

        this.adminState.next(null);

      }

    });
  }


  // ==================================================
  // PROTECTED DATA
  // ==================================================

  getProtectedData(): Observable<any> {

    return this.http.get(
      `${this.adminUrl}/adminProtected`
    );
  }

  protectRoute(): boolean {

    const token = this.getToken();

    if (!token) {

      this.router.navigate([
        '/admin/login'
      ]);

      return false;
    }

    return true;
  }


  // ==================================================
  // BANNER
  // ==================================================

  updateBanner(formData: FormData): Observable<any> {

    return this.http.put(
      `${this.adminUrl}/save_banner`,
      formData
    );
  }

  getBanner() {

    return this.http.get(
      `${this.adminUrl}/manage_banner`
    );
  }


  // ==================================================
  // PRODUCT TYPES
  // ==================================================

  saveProductType(product_type: any) {

    return this.http.post(
      `${this.adminUrl}/save_product_type`,
      product_type
    );
  }

  getProductTypes() {

    return this.http.get(
      `${this.adminUrl}/product_types`
    );
  }

  getOneProductType(product_type_id: any) {

    return this.http.get(
      `${this.adminUrl}/one_product_type/${product_type_id}`
    );
  }

  updateProductType(
    product_type_id: any,
    product_type_name: string
  ) {

    return this.http.put(
      `${this.adminUrl}/edit_product_type/${product_type_id}`,
      {
        product_type_name
      }
    );
  }

  deleteProductType(
    product_type_id: number
  ) {

    return this.http.delete(
      `${this.adminUrl}/delete_product_type/${product_type_id}`
    );
  }


  // ==================================================
  // PRODUCTS
  // ==================================================

  saveProduct(productData: FormData) {

    return this.http.post(
      `${this.adminUrl}/save_product`,
      productData
    );
  }

  getProducts() {

    return this.http.get(
      `${this.adminUrl}/products`
    );
  }

  searchProducts(searchString: string) {

    return this.http.get(
      `${this.adminUrl}/product_search?str=${searchString}`
    );
  }

  getProduct(product_id: any) {

    return this.http.get(
      `${this.adminUrl}/single_product/${product_id}`
    );
  }

  getProductImages(product_id: any) {

    return this.http.get(
      `${this.adminUrl}/product_images/${product_id}`
    );
  }

  updateProduct(
    product_id: any,
    formData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/product_update/${product_id}`,
      formData
    );
  }

  deleteProduct(product_id: any) {

    console.log(
      'Came product id is : ',
      product_id
    );

    return this.http.delete(
      `${this.adminUrl}/product_delete/${product_id}`
    );
  }


  // ==================================================
  // INTERIOR
  // ==================================================

  getInterior() {

    return this.http.get(
      `${this.adminUrl}/interior_data`
    );
  }

  updateInterior(
    interior_data: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_interior`,
      interior_data
    );
  }


  // ==================================================
  // TESTIMONIAL
  // ==================================================

  saveTestimonial(
    testimonial_data: FormData
  ) {

    return this.http.post(
      `${this.adminUrl}/save_testimonial`,
      testimonial_data
    );
  }

  getTestimonials() {

    return this.http.get(
      `${this.adminUrl}/get_testimonial`
    );
  }

  getOneTestimonial(id: any) {

    return this.http.get(
      `${this.adminUrl}/get_one_testimonial/${id}`
    );
  }

  updateTestimonial(
    customer_id: any,
    testimonial_data: any
  ) {

    return this.http.put(
      `${this.adminUrl}/update_testimonial/${customer_id}`,
      testimonial_data
    );
  }

  deleteTestimonial(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_testimonial/${id}`
    );
  }


  // ==================================================
  // WHY CHOOSE US
  // ==================================================

  updateWhyChooseUs(
    formData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_why_choose_us`,
      formData
    );
  }

  getWhyChooseUs() {

    return this.http.get(
      `${this.adminUrl}/get_why_choose_us`
    );
  }

  saveWhyChooseUsPoint(
    formData: FormData
  ) {

    return this.http.post(
      `${this.adminUrl}/save_why_choose_us_point`,
      formData
    );
  }

  getWhyChooseUsPoints() {

    return this.http.get(
      `${this.adminUrl}/get_why_choose_points`
    );
  }

  getWhyChooseUsPointById(id: any) {

    return this.http.get(
      `${this.adminUrl}/get_why_choose_point/${id}`
    );
  }

  updateWhyChooseUsPoint(
    id: any,
    updatePointFormData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_why_choose_point/${id}`,
      updatePointFormData
    );
  }

  deleteWhyChooseUsPoint(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_why_choose_point/${id}`
    );
  }


  // ==================================================
  // BLOG
  // ==================================================

  saveBlog(formData: FormData) {

    return this.http.post(
      `${this.adminUrl}/save_blog`,
      formData
    );
  }

  getBlogs() {

    return this.http.get(
      `${this.adminUrl}/get_blogs`
    );
  }

  getSingleBlog(id: any) {

    return this.http.get(
      `${this.adminUrl}/get_single_blog/${id}`
    );
  }

  updateBlog(
    id: any,
    formData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_blog/${id}`,
      formData
    );
  }

  deleteBlog(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_blog/${id}`
    );
  }


  // ==================================================
  // TEAM
  // ==================================================

  saveTeamMember(formData: FormData) {

    return this.http.post(
      `${this.adminUrl}/save_team_member`,
      formData
    );
  }

  getTeamMembers() {

    return this.http.get(
      `${this.adminUrl}/get_team_members`
    );
  }

  getSingleTeamMember(id: any) {

    return this.http.get(
      `${this.adminUrl}/get_single_team_member/${id}`
    );
  }

  updateTeamMember(
    id: any,
    updateFormData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_team_member/${id}`,
      updateFormData
    );
  }

  deleteTeamMember(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_team_member/${id}`
    );
  }


  // ==================================================
  // ORDERS
  // ==================================================

  getOrders() {

    return this.http.get(
      `${this.adminUrl}/get_orders`
    );
  }

  getSingleOrder(id: any) {

    return this.http.get(
      `${this.adminUrl}/get_order_details/${id}`
    );
  }

  updateOrder(orderDetails: any) {

    return this.http.put(
      `${this.adminUrl}/update_order`,
      orderDetails
    );
  }


  // ==================================================
  // CONTACT
  // ==================================================

  getContactUs() {

    return this.http.get(
      `${this.adminUrl}/contact_us`
    );
  }

  deleteContactUs(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_contact_us/${id}`
    );
  }


  // ==================================================
  // SUBSCRIBERS
  // ==================================================

  getSubscribers() {

    return this.http.get(
      `${this.adminUrl}/get_subscribers`
    );
  }

  updateSubscriber(
    subscriberData: any
  ) {

    return this.http.put(
      `${this.adminUrl}/update_subscriber`,
      subscriberData
    );
  }

  deleteSubscriber(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_subscriber/${id}`
    );
  }


  // ==================================================
  // REVIEWS
  // ==================================================

  getReviews() {

    return this.http.get(
      `${this.adminUrl}/get_reviews`
    );
  }

  updateReview(
    updateFormData: FormData
  ) {

    return this.http.put(
      `${this.adminUrl}/update_review`,
      updateFormData
    );
  }

  deleteReview(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_review/${id}`
    );
  }


  // ==================================================
  // WISHLIST
  // ==================================================

  getAllWishlist() {

    return this.http.get(
      `${this.adminUrl}/get_wishlist`
    );
  }

  deleteWishlistItem(id: any) {

    return this.http.delete(
      `${this.adminUrl}/delete_wishlist_item/${id}`
    );
  }


  // ==================================================
  // FORGOT PASSWORD / OTP
  // ==================================================

  sendOtp(data: any): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/send-otp`,
      data
    );
  }

  verifyOtp(data: any): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/verify-otp`,
      data
    );
  }

  adminRegisterSendOtp(
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/admin-register-send-otp`,
      data
    );
  }

  adminRegisterVerifyOtp(
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.adminUrl}/admin-register-verify-otp`,
      data
    );
  }

}