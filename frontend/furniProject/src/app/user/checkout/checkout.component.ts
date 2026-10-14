import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

import { PaymentService } from '../../service/payment.service';
import { UserApiService } from '../../service/user-api.service';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
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

  payment_Key_id: any;

  // Checkout Page Loading
  checkoutPageLoading: boolean = false;

  private isInitialLoad: boolean = true;
  private initialRequestsCompleted: number = 0;

  // Order Processing
  isProcessing: boolean = false;

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService
  ) {

    this.checkoutForm = this.fb.group({

      c_country: [
        '',
        Validators.required
      ],

      c_fname: [
        '',
        Validators.required
      ],

      c_lname: [
        '',
        Validators.required
      ],

      c_address: [
        '',
        Validators.required
      ],

      c_area: [
        ''
      ],

      c_state: [
        '',
        Validators.required
      ],

      c_postal_zip: [
        '',
        Validators.required
      ],

      c_email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      c_phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      payment_mode: [
        'Online',
        Validators.required
      ]

    });

  }

  ngOnInit(): void {

    // Start checkout page skeleton
    this.checkoutPageLoading = true;

    this.getCartProducts();
    this.fetchUserDetails();
    this.getRazorPay_key();

  }

  // Initial Loading Check
  private checkInitialLoadingComplete(): void {

    this.initialRequestsCompleted++;

    if (this.initialRequestsCompleted >= 3) {

      setTimeout(() => {

        this.checkoutPageLoading = false;
        this.isInitialLoad = false;

      }, 700);

    }

  }

  // =========================================================
  // Fetch User Details
  // =========================================================

  fetchUserDetails(): void {

    this.userApi.getUserInfo()
      .pipe(
        finalize(() => {

          if (this.isInitialLoad) {
            this.checkInitialLoadingComplete();
          }

        })
      )
      .subscribe({

        next: (res: any) => {

          if (
            res.status === 'success' &&
            res.user
          ) {

            const userName =
              res.user.user_name || '';

            const nameParts =
              userName.trim().split(/\s+/);

            this.checkoutForm.patchValue({

              c_fname:
                nameParts[0] || '',

              c_lname:
                nameParts.slice(1).join(' ') || '',

              c_phone:
                res.user.user_mobile || '',

              c_email:
                res.user.user_email || '',

              c_address:
                res.user.user_address || ''

            });

          } else {

            this.toastr.error(
              'Failed to fetch user details',
              'Error',
              {
                disableTimeOut: false,
                progressBar: true,
                closeButton: true
              }
            );

          }

        },

        error: (err: any) => {

          console.error(
            'Error fetching user details:',
            err
          );

        }

      });

  }

  // Get Cart Products
  getCartProducts(): void {

    this.userApi.getCartItems()
      .pipe(
        finalize(() => {

          if (this.isInitialLoad) {
            this.checkInitialLoadingComplete();
          }

        })
      )
      .subscribe({

        next: (res: any) => {

          if (res?.products) {

            this.cartProducts =
              res.products;

            this.calculateTotals();

          } else {

            this.cartProducts = [];

            this.calculateTotals();

          }

        },

        error: (err: any) => {

          console.error(
            'Error fetching cart products:',
            err
          );

          this.cartProducts = [];

          this.calculateTotals();

        }

      });

  }

  // Calculate Totals
  calculateTotals(): void {

    this.subtotal = 0;
    this.totalGST = 0;
    this.totalDiscount = 0;

    this.cartProducts.forEach(item => {

      const productPrice =
        Number(item.product_price || 0);

      const quantity =
        Number(item.qty || 0);

      const gstPercentage =
        Number(item.gst_percentage || 0);

      const discountPercentage =
        Number(item.discount_percentage || 0);

      const productTotal =
        productPrice * quantity;

      const gstAmount =
        (
          productTotal *
          gstPercentage
        ) / 100;

      const discountAmount =
        (
          productTotal *
          discountPercentage
        ) / 100;

      this.subtotal += productTotal;
      this.totalGST += gstAmount;
      this.totalDiscount += discountAmount;

    });

    this.finalTotal =
      (
        this.subtotal +
        this.totalGST
      ) -
      this.totalDiscount;

    console.log(
      'Final total is :- ' +
      this.finalTotal
    );

  }

  // Get Razorpay Key
  getRazorPay_key(): void {

    this.paymentService.getId()
      .pipe(
        finalize(() => {

          if (this.isInitialLoad) {
            this.checkInitialLoadingComplete();
          }

        })
      )
      .subscribe({

        next: (res: any) => {

          if (
            res.status === 'success' &&
            res.key_id
          ) {

            this.payment_Key_id =
              res.key_id;

          } else {

            this.toastr.error(
              'Failed to fetch payment key.',
              'Error',
              {
                disableTimeOut: false,
                progressBar: true,
                closeButton: true
              }
            );

          }

        },

        error: (err: any) => {

          console.error(
            'Error fetching Razorpay key:',
            err
          );

          this.toastr.error(
            'Authorization failed or server error.',
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

  // Place Order
  placeOrder(): void {

    const token =
      localStorage.getItem('userToken');

    if (!token) {

      this.toastr.error(
        'You must be logged in to place an order.',
        'Error',
        {
          disableTimeOut: false,
          progressBar: true,
          closeButton: true
        }
      );

      this.router.navigate([
        '/user/login'
      ]);

      return;

    }

    // Prevent multiple clicks
    if (this.isProcessing) {
      return;
    }

    // Form Validation
    if (!this.checkoutForm.valid) {

      this.checkoutForm.markAllAsTouched();

      this.toastr.error(
        'Please fill in all required fields.',
        'Error',
        {
          disableTimeOut: false,
          progressBar: true,
          closeButton: true
        }
      );

      return;

    }

    // Prevent placing order without products
    if (this.cartProducts.length === 0) {

      this.toastr.warning(
        'Your cart is empty.',
        'Warning',
        {
          disableTimeOut: false,
          progressBar: true,
          closeButton: true
        }
      );

      this.router.navigate([
        '/user/cart'
      ]);

      return;

    }

    const orderData = {

      ...this.checkoutForm.value,

      cartProducts:
        this.cartProducts,

      totalAmount:
        this.finalTotal

    };

    this.isProcessing = true;

    // COD
    if (
      orderData.payment_mode === 'COD'
    ) {

      this.paymentService
        .placeCODOrder(orderData)
        .subscribe({

          next: (res: any) => {

            if (
              res.status === 'success'
            ) {

              this.toastr.success(
                'Order placed successfully!',
                'Success',
                {
                  disableTimeOut: false,
                  progressBar: true,
                  closeButton: true
                }
              );

              this.clearCart();

              this.router.navigate([
                '/user/orders'
              ]);

            } else {

              this.isProcessing = false;

              this.toastr.error(
                'Failed to place order. Try again.',
                'Error',
                {
                  disableTimeOut: false,
                  progressBar: true,
                  closeButton: true
                }
              );

            }

          },

          error: (err: any) => {

            console.error(
              'COD order error:',
              err
            );

            this.isProcessing = false;

            this.toastr.error(
              err?.error?.message ||
              'Failed to place order. Try again.',
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

    // Online Payment
    else {
      this.launchRazorpay(orderData.totalAmount);
    }

  }

  // Launch Razorpay
  async launchRazorpay(
    amount: number
  ): Promise<void> {

    // If key is already available, use it.
    // Otherwise fetch it again.

    if (!this.payment_Key_id) {

      this.paymentService.getId().subscribe({

        next: (res: any) => {

          if (
            res.status === 'success' &&
            res.key_id
          ) {

            this.payment_Key_id =
              res.key_id;

            this.openRazorpay(amount);

          } else {

            this.isProcessing = false;

            this.toastr.error(
              'Failed to fetch payment key.',
              'Error',
              {
                disableTimeOut: false,
                progressBar: true,
                closeButton: true
              }
            );

          }

        },

        error: (err: any) => {

          console.error(
            'Error fetching Razorpay key:',
            err
          );

          this.isProcessing = false;

          this.toastr.error(
            'Unable to initialize payment.',
            'Error',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

        }

      });

      return;

    }

    this.openRazorpay(amount);

  }

  // Open Razorpay
  private openRazorpay(
    amount: number
  ): void {

    this.paymentService
      .createOrder(
        amount,
        'INR'
      )
      .subscribe({

        next: (res: any) => {

          if (res.success) {

            const options = {

              key:
                this.payment_Key_id,

              amount:
                res.order.amount,

              currency:
                'INR',

              name:
                'E-commerce Store',

              order_id:
                res.order.id,

              handler: (response: any) => {

                this.verifyPayment(
                  response
                );

              },

              modal: {

                ondismiss: () => {

                  this.isProcessing =
                    false;

                  this.toastr.info(
                    'Payment was cancelled.',
                    'Payment Cancelled',
                    {
                      progressBar: true,
                      closeButton: true
                    }
                  );

                }

              }

            };

            const rzp =
              new Razorpay(options);

            rzp.open();

          } else {

            this.isProcessing = false;

            this.toastr.error(
              'Unable to create payment order.',
              'Payment Error',
              {
                progressBar: true,
                closeButton: true
              }
            );

          }

        },

        error: (err: any) => {

          console.error(
            'Razorpay order creation error:',
            err
          );

          this.isProcessing = false;

          this.toastr.error(
            err?.error?.message ||
            'Unable to create payment order.',
            'Payment Error',
            {
              progressBar: true,
              closeButton: true
            }
          );

        }

      });

  }

  // Verify Payment
  verifyPayment(paymentData: any): void {

    const orderData = {
      ...this.checkoutForm.value,
      cartProducts: this.cartProducts,
      totalAmount: this.finalTotal
    };

    this.paymentService.verifyPayment({
      ...paymentData,
      orderDetails: orderData
    }).subscribe({
      next: (res: any) => {
        if (res.success) {

          this.toastr.success(
            res.message ||
            'Payment successful! Order placed.',
            'Success',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

          this.clearCart();
          this.router.navigate(['/user/orders']);

        } else {

          this.isProcessing = false;

          this.toastr.error(
            'Payment verification failed.',
            'Error',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

        }

      },

      error: (error: any) => {

        console.error(
          'Error verifying payment:',
          error
        );

        this.isProcessing = false;

        this.toastr.error(
          'Something went wrong with payment verification.',
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

  // Clear Cart
  clearCart(): void {

    this.userApi
      .clearCart()
      .subscribe({

        next: (res: any) => {

          if (
            res.status === 'success'
          ) {

            this.cartProducts = [];

            this.calculateTotals();

          } else {

            this.toastr.error(
              'Failed to clear cart. Try again.',
              'Error',
              {
                disableTimeOut: false,
                progressBar: true,
                closeButton: true
              }
            );

          }

        },

        error: (err: any) => {

          console.error(
            'Clear cart error:',
            err
          );

        }

      });

  }

}