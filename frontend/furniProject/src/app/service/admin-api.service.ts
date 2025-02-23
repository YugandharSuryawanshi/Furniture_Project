import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  private tokenKey = 'adminToken'; // Key to store JWT token
  private adminState = new BehaviorSubject<any>(null); // Tracks admin details
  adminState$ = this.adminState.asObservable(); // Observable for components to subscribe to
  
  constructor(private http: HttpClient, private router: Router) { }
  
  // Fetch all users (for admin)
  get_users()
  {
    return this.http.get('http://localhost:1000/admin/get_users');
  }

  //Fetch single user
  get_user(id: any)
  {
    return this.http.get(`http://localhost:1000/admin/get_user/${id}`);
  }

  // Update user
  updateUser(id:any, formData: FormData)
  {
    return this.http.put(`http://localhost:1000/admin/update_user/${id}`, formData);
  }

  // Delete a user
  deleteUser(id: any)
  {
    return this.http.delete(`http://localhost:1000/admin/delete_user/${id}`);
  }

  // Register a new admin
  adminRegister(admin: {
    admin_name: string;
    admin_mobile: any;
    admin_email: any;
    admin_password: string
  }): Observable<any> {
    return this.http.post('http://localhost:1000/admin/adminRegister', admin);
  }

  // Admin login method
  adminLogin(admin: {
    admin_email: any;
    admin_password: any
  }): Observable<any> {
    return this.http.post('http://localhost:1000/admin/adminLogin', admin);
  }

  // Check if the admin is logged in
  isAdminLoggedIn(): boolean {

    return !!localStorage.getItem(this.tokenKey);
  }

  // Admin logout method
  adminLogout(){
    if (confirm('Are you sure!! You want to logout?')) {
      const token = this.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.post('http://localhost:1000/admin/adminLogout', {}, { headers }).subscribe({
        next: () => {
          this.clearToken();
          //This line we have to remove after last..........
          localStorage.removeItem(this.tokenKey); // Remove token from localStorage
          this.router.navigate(['/admin/login']); // Redirect to login page
        },
        error: (err) => {
          this.clearToken();
          localStorage.removeItem(this.tokenKey); // Remove token from localStorage
          this.router.navigate(['/admin/login']); // Redirect to login page
        }
      });
  
    }
  }

  // Update Admin Details and profile
  updateProfile(profile: any, headers: HttpHeaders) {
    return this.http.post('http://localhost:1000/admin/update_admin', profile, { headers });
  }

  // Fetch or getting admin Details
  getAdminDetails()
  {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No adminToken found');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:1000/admin/admin_details', { headers });
  }
  
  // Delete admin Account
  deleteAdminAccount(): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>('http://localhost:1000/admin/delete_admin', { headers });
  }

  // Get the JWT token from localStorage
  getToken(): string {
    return localStorage.getItem(this.tokenKey) || ''; // Return token if available, else empty string
  }

  // Set the JWT token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // Store token in localStorage
    this.fetchAdminDetails();
  }

  // Clear the admin token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.adminState.next(null);
  }

  // Fetch Admin Details this route is for when admin is login that time profile view
  fetchAdminDetails(): void {
    const token = this.getToken();
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:1000/admin/admin_details', { headers }).subscribe(
      (data: any) => {
        if (data.success) {
          this.adminState.next(data.admin); // Update admin state
        } else {
          this.adminState.next(null); // Clear admin state
        }
      },
      (error) => {
        console.error('Error fetching admin details:', error);
        this.adminState.next(null); // Clear admin state
      }
    );
  }

  // Get protected data by sending the token in Authorization header
  getProtectedData(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:1000/admin/adminProtected', { headers });
  }

  // Protect routes by checking if the token exists
  protectRoute(): boolean {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/admin/login']); // Redirect to login if no token
      return false; // Deny access
    }
    // You can add additional logic to verify the token or make API calls for further verification
    return true; // Allow access
  }

  // Update Banner
  updateBanner(formData: FormData): Observable<any> {
    return this.http.put('http://localhost:1000/admin/save_banner', formData);
  }

  //Fetch Banner Details
  getBanner()
  {
    return this.http.get('http://localhost:1000/admin/manage_banner');
  }

  //Add New Product Type
  saveProductType(product_type: any) {
    return this.http.post('http://localhost:1000/admin/save_product_type', product_type);
  }

  //Fetch All Product Types
  getProductTypes()
  {
    return this.http.get('http://localhost:1000/admin/product_types');
  }
  
  //Fetch One Product Type Details by Id
  getOneProductType(product_type_id:any)
  {
    return this.http.get(`http://localhost:1000/admin/one_product_type/${product_type_id}`);
  }

// Update the product type
  updateProductType(product_type_id: any, product_type_name: string)
  {
    return this.http.put(`http://localhost:1000/admin/edit_product_type/${product_type_id}`, { product_type_name });
  }

  // Delete Product Type by Id
  deleteProductType(product_type_id: number) {
    return this.http.delete(`http://localhost:1000/admin/delete_product_type/${product_type_id}`);
  }

  //Add New Product
  saveProduct(productData: FormData) {
    return this.http.post(`http://localhost:1000/admin/save_product`, productData);
  }

  //Fetch All Products
  getProducts()
  {
    return this.http.get(`http://localhost:1000/admin/products`);
  }
  
  // Search products
  searchProducts(searchString: string) {
    return this.http.get(`http://localhost:1000/admin/product_search?str=${searchString}`);
  }

  //Get Single Product
  getProduct(product_id: any)
  {
    return this.http.get(`http://localhost:1000/admin/single_product/${product_id}`);
  }

  //get that single product Images
  getProductImages(product_id: any)
  {
    return this.http.get(`http://localhost:1000/admin/product_images/${product_id}`);
  }

  //Upadate Product Details
  updateProduct(product_id: any ,formData: FormData)
  {
    return this.http.put(`http://localhost:1000/admin/product_update/${product_id}`, formData);
  }

  //DELETE Product
  deleteProduct(product_id: any) {
    return this.http.delete(`http://localhost:1000/admin/product_delete/${product_id}`);
  }

  //Get Interior
  getInterior()
  {
    return this.http.get(`http://localhost:1000/admin/interior_data`);
  }

  //Update interior
  updateInterior(interior_data : FormData)
  {
    return this.http.put(`http://localhost:1000/admin/update_interior`, interior_data );
  }

  //Save Testimonial
  saveTestimonial(testimonial_data : FormData)
  {
    return this.http.post(`http://localhost:1000/admin/save_testimonial`, testimonial_data );
  }

  //Get Testimonials
  getTestimonials()
  {
    return this.http.get(`http://localhost:1000/admin/get_testimonial`);
  }

  //get Specific One Testimonial
  getOneTestimonial(id: any)
  {
    return this.http.get(`http://localhost:1000/admin/get_one_testimonial/${id}`);
  }

  //Update Testimonial
  updateTestimonial(customer_id:any,testimonial_data : any)
  {
    return this.http.put(`http://localhost:1000/admin/update_testimonial/${customer_id}`, testimonial_data );
  }

  //Delete Testimonial
  deleteTestimonial(id: any) {
    return this.http.delete(`http://localhost:1000/admin/delete_testimonial/${id}`);
  }

  //Save AND UPDATE WHY Choose Us Section
  updateWhyChooseUs(formData: FormData) {
    return this.http.put(`http://localhost:1000/admin/update_why_choose_us`, formData);
  }

  //Get Information Why Choose US Section
  getWhyChooseUs() {
    return this.http.get(`http://localhost:1000/admin/get_why_choose_us`);
  }

  //Save Why Choose US Point
  saveWhyChooseUsPoint(formData: FormData) {
    return this.http.post(`http://localhost:1000/admin/save_why_choose_us_point`, formData);
}

  //Get Why Choose US Point All
  getWhyChooseUsPoints() {
    return this.http.get(`http://localhost:1000/admin/get_why_choose_points`);
  }

  //Get Single Point By ID
  getWhyChooseUsPointById(id:any)
  {
    return this.http.get(`http://localhost:1000/admin/get_why_choose_point/${id}`);
  }

  //Update Why Choose Us Point
  updateWhyChooseUsPoint(id:any, updatePointFormData: FormData)
  {
    return this.http.put(`http://localhost:1000/admin/update_why_choose_point/${id}`, updatePointFormData);
  }

  //Delete Why Choose Us Point
  deleteWhyChooseUsPoint(id: any) {
    return this.http.delete(`http://localhost:1000/admin/delete_why_choose_point/${id}`);
  }

  //Save Blog Information
  saveBlog(formData: FormData)
  {
    return this.http.post(`http://localhost:1000/admin/save_blog`, formData);
  }

  //Get All Blogs
  getBlogs()
  {
    return this.http.get(`http://localhost:1000/admin/get_blogs`);
  }

  //Get Single Blog By ID
  getSingleBlog(id:any)
  {
    return this.http.get(`http://localhost:1000/admin/get_single_blog/${id}`);
  }

  //Update Blog Information
  updateBlog(id:any, formData: FormData)
  {
    return this.http.put(`http://localhost:1000/admin/update_blog/${id}`, formData);
  }

  //Delete Blog
  deleteBlog(id: any) {
    return this.http.delete(`http://localhost:1000/admin/delete_blog/${id}`);
  }

  // Save Our Team Member Details
  saveTeamMember(formData: FormData)
  {
    return this.http.post(`http://localhost:1000/admin/save_team_member`, formData);
  }

  // Get All Team Members
  getTeamMembers()
  {
    return this.http.get(`http://localhost:1000/admin/get_team_members`);
  }

  // Get Single Team Member By ID
  getSingleTeamMember(id:any)
  {
    return this.http.get(`http://localhost:1000/admin/get_single_team_member/${id}`);
  }

  // Update Team Member Details
  updateTeamMember(id:any, updateFormData: FormData)
  {
    return this.http.put(`http://localhost:1000/admin/update_team_member/${id}`, updateFormData);
  }

  // Delete Team Member
  deleteTeamMember(id: any) {
    return this.http.delete(`http://localhost:1000/admin/delete_team_member/${id}`);
  }

  // Get Order Details
  getOrders()
  {
    return this.http.get(`http://localhost:1000/admin/get_orders`);
  }

  // Get Single Order By ID
  getSingleOrder(id:any)
  {
    return this.http.get(`http://localhost:1000/admin/get_order_details/${id}`);
  }

  // UPdate Order Status
  updateOrder(orderDetails:any)
  {
    return this.http.put(`http://localhost:1000/admin/update_order`, orderDetails);
  }


}
