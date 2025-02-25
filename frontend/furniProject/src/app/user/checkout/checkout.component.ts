import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../service/payment.service';
import { UserApiService } from '../../service/user-api.service';

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
  totalGST: number = 0;
  totalDiscount: number = 0;
  finalTotal: number = 0;
  payment_Key_id:any;

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
        } else {
          this.toastr.error('Failed to fetch user details', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true });
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
    this.subtotal = 0;
    this.totalGST = 0;
    this.totalDiscount = 0;

    this.cartProducts.forEach(item => {
        const productTotal = item.product_price * item.qty; // Subtotal for each product
        const gstAmount = (productTotal * item.gst_percentage) / 100; // GST on this product
        const discountAmount = (productTotal * item.discount_percentage) / 100; // Discount on this product

        this.subtotal += productTotal;
        this.totalGST += gstAmount;
        this.totalDiscount += discountAmount;
    });

    // Final Total Payable Amount IS
    this.finalTotal = (this.subtotal + this.totalGST) - this.totalDiscount;
}

getRazorPay_key()
{
  this.paymentService.getId().subscribe((res:any)=>{
    if(res.status ==='success' && res.key_id)
    {
      this.payment_Key_id = res.key_id;
    }
    else
    {
      this.toastr.error('Failed to fetch payment key.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
    }
  })
}

  placeOrder() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      this.toastr.error("You must be logged in to place an order.", 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
      this.router.navigate(['/user/login']);
      return;
    }

    // Single Form Validation Check
    if (!this.checkoutForm.valid) {
      this.toastr.error('Please fill in all required fields.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
      return;
    }

    const orderData = {
      ...this.checkoutForm.value,
      cartProducts: this.cartProducts,
      totalAmount: this.finalTotal
    };

    if (orderData.payment_mode === 'cod') {
      this.paymentService.placeCODOrder(orderData).subscribe(
        (res: any) => {
          if (res.status === 'success') {
            this.toastr.success('Order placed successfully!', "Success", {disableTimeOut: false , progressBar:true , closeButton: true});
            this.clearCart();
            this.router.navigate(['/user/orders']);
          } else {
            this.toastr.error('Failed to place order. Try again.', 'error', {disableTimeOut: false, progressBar:true , closeButton: true});
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
            key: this.payment_Key_id, //Store securely Came towards Backend.
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
      totalAmount: this.finalTotal
    };

    this.paymentService.verifyPayment({ ...paymentData, orderDetails: orderData }).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Payment successful! Order placed.', "Success", { disableTimeOut: false, progressBar:true, closeButton: true });
          this.clearCart();  // Call clearCart after payment success
          this.router.navigate(['/user/orders']);
        } else {
          this.toastr.error('Payment verification failed.', 'error', {disableTimeOut: false, progressBar:true, closeButton: true});
        }
      },
      (error) => {
        console.error(" Error verifying payment:", error);
        this.toastr.error('Something went wrong with payment verification.', 'error', { disableTimeOut: false ,progressBar:true ,  closeButton: true });
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
        this.toastr.error('Failed to clear cart. Try again.', 'error', { disableTimeOut: false, progressBar:true, closeButton: true });
      }
    });
  }

}
