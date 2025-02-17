import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';
import { PaymentService } from '../../service/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartProducts: any[] = [];
  subtotal: number = 0;
  discount: number = 0;
  gst: number = 0;
  total: number = 0;

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService)
  {
    this.checkoutForm = this.fb.group({
      c_country: ['', Validators.required],
      c_fname: ['', Validators.required],
      c_lname: ['', Validators.required],
      c_address: ['', Validators.required],
      c_area: [''],
      c_state: ['', Validators.required],
      c_postal_zip: ['', Validators.required],
      c_email: ['', [Validators.required, Validators.email]],
      c_phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // ✅ Ensured valid phone number pattern
      payment_mode: ['online', Validators.required]  // Default to online
    });
  }

  ngOnInit(): void {
    this.getCartProducts();
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.userApi.getUserInfo().subscribe(
      (res: any) => {
        if (res.status === 'success' && res.user) {
          this.checkoutForm.patchValue({
            c_fname: res.user.user_name.split(' ')[0] || '',
            c_lname: res.user.user_name.split(' ')[1] || '',
            c_phone: res.user.user_mobile,
            c_email: res.user.user_email,
            c_address: res.user.user_address
          });
          console.log('User Info:', res);
        } else {
          this.toastr.error('Failed to fetch user details');
        }
      });
  }

  getCartProducts() {
    this.userApi.getCartItems().subscribe(
      (res: any) => {
        if (res.products) {
          this.cartProducts = res.products;
          this.calculateTotals();
        }
      });
  }

  calculateTotals() {
    this.subtotal = this.cartProducts.reduce((acc, item) => acc + (item.product_price * item.qty), 0);
  
    this.gst = Math.ceil(this.subtotal * 0.12); // GST applied on the full subtotal (before discount)
  
    this.discount = Math.round(this.subtotal * 0.2); // 20% discount applied after GST calculation
  
    this.total = Math.ceil(this.subtotal + this.gst - this.discount); //Final total
  }

  placeOrder() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      this.toastr.error("You must be logged in to place an order.", 'error', { disableTimeOut: false, closeButton: true });
      this.router.navigate(['/user/login']);
      return;
    }

    // Single Form Validation Check
    if (!this.checkoutForm.valid) {
      this.toastr.error('Please fill in all required fields.', 'error', { disableTimeOut: false, closeButton: true });
      return;
    }

    const orderData = {
      ...this.checkoutForm.value,
      cartProducts: this.cartProducts,
      totalAmount: this.total
    };

    if (orderData.payment_mode === 'cod') {
      this.paymentService.placeCODOrder(orderData).subscribe(
        (res: any) => {
          if (res.status === 'success') {
            this.toastr.success('Order placed successfully!', "Success", {disableTimeOut: false , closeButton: true});
            this.clearCart();
            this.router.navigate(['/user/orders']);
          } else {
            this.toastr.error('Failed to place order. Try again.', 'error', {disableTimeOut: false, closeButton: true});
          }
        });
    } else {
      this.launchRazorpay(orderData.totalAmount);
    }
  }

  launchRazorpay(amount: number) {
    this.paymentService.createOrder(amount, 'INR').subscribe(
      (res: any) => {
        if (res.success) {
          const options = {
            key: "rzp_test_a5ccNst7Xe98mG", // Store securely
            amount: res.order.amount,
            currency: "INR",
            name: "E-commerce Store",
            order_id: res.order.id,
            handler: (response: any) => {
              this.verifyPayment(response);
            }
          };
          const rzp = new Razorpay(options);
          rzp.open();
        }
      });
  }

  verifyPayment(paymentData: any) {
    const orderData = {
      ...this.checkoutForm.value,
      cartProducts: this.cartProducts,
      totalAmount: this.total
    };

    this.paymentService.verifyPayment({ ...paymentData, orderDetails: orderData }).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Payment successful! Order placed.', "Success", { disableTimeOut: false, closeButton: true });
          this.clearCart();  // Call clearCart after payment success
          this.router.navigate(['/user/orders']);
        } else {
          this.toastr.error('Payment verification failed.', 'error', {disableTimeOut: false, closeButton: true});
        }
      },
      (error) => {
        console.error(" Error verifying payment:", error);
        this.toastr.error('Something went wrong with payment verification.', 'error', { disableTimeOut: false , closeButton: true });
      }
    );
}

  clearCart() {
    this.userApi.clearCart().subscribe((res: any) => {
      if (res.status === 'success') {
        this.cartProducts = [];
        this.getCartProducts();
      }
      else {
        this.toastr.error('Failed to clear cart. Try again.');
      }
    });
  }



}
