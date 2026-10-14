import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

import { UserApiService } from '../../service/user-api.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  // =========================================================
  // Orders
  // =========================================================

  orders: any[] = [];

  // =========================================================
  // Page Loading
  // =========================================================

  ordersPageLoading: boolean = false;

  private isInitialLoad: boolean = true;

  // =========================================================
  // Tracking
  // =========================================================

  showTracking: boolean = false;

  trackingLoading: boolean = false;

  trackingOrderId: number | null = null;

  trackingProgress: number = 0;

  trackingStatus: string = '';

  // =========================================================
  // Order Actions
  // =========================================================

  cancellingOrderId: number | null = null;

  // =========================================================
  // Tracking Steps
  // =========================================================

  trackingSteps = [
    {
      label: 'Order Placed',
      progress: 10,
      icon: 'fas fa-box'
    },
    {
      label: 'Confirmed',
      progress: 30,
      icon: 'fas fa-check-circle'
    },
    {
      label: 'Dispatched',
      progress: 50,
      icon: 'fas fa-truck'
    },
    {
      label: 'Out for Delivery',
      progress: 80,
      icon: 'fas fa-shipping-fast'
    },
    {
      label: 'Delivered',
      progress: 100,
      icon: 'fas fa-home'
    }
  ];

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService
  ) { }

  // =========================================================
  // Page Init
  // =========================================================

  ngOnInit(): void {

    this.ordersPageLoading = true;

    this.loadOrders();

  }

  // =========================================================
  // Load Orders
  // =========================================================

  loadOrders(): void {

    this.userApi.getMyOrders()
      .pipe(

        finalize(() => {

          if (this.isInitialLoad) {

            // Keep skeleton visible for a short time
            // so fast API responses are also visible.

            setTimeout(() => {

              this.ordersPageLoading = false;

              this.isInitialLoad = false;

            }, 700);

          }

        })

      )
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.orders =
              res.orders || [];

          } else {

            this.orders = [];

            this.toastr.error(
              'Failed to fetch orders.',
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
            'Error fetching orders:',
            error
          );

          this.orders = [];

          this.toastr.error(
            'Something went wrong while fetching your orders.',
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

  // =========================================================
  // Open Tracking Modal
  // =========================================================

  openTrackingModal(
    orderId: number,
    orderStatus: string
  ): void {

    // Cancelled order cannot be tracked

    if (orderStatus === 'Cancelled') {

      this.toastr.warning(
        'This order has been canceled. Tracking is unavailable.',
        'Warning',
        {
          disableTimeOut: false,
          progressBar: true,
          closeButton: true
        }
      );

      return;

    }

    // Open modal

    this.showTracking = true;

    this.trackingLoading = true;

    this.trackingOrderId = orderId;

    this.trackingProgress = 0;

    this.trackingStatus = '';

    // Fetch tracking details

    this.userApi
      .getOrderTracking(orderId)
      .pipe(

        finalize(() => {

          this.trackingLoading = false;

        })

      )
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.trackingProgress =
              Number(res.progress || 0);

            this.trackingStatus =
              res.order_status || '';

          } else {

            this.toastr.error(
              'Failed to fetch order status.',
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
            'Error tracking order:',
            error
          );

          this.toastr.error(
            'Something went wrong.',
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

  // =========================================================
  // Close Tracking Modal
  // =========================================================

  closeTrackingModal(): void {

    this.showTracking = false;

    this.trackingLoading = false;

    this.trackingOrderId = null;

    this.trackingProgress = 0;

    this.trackingStatus = '';

  }

  // =========================================================
  // Cancel Order
  // =========================================================

  cancelOrder(orderId: number): void {

    // Prevent duplicate cancellation requests

    if (this.cancellingOrderId !== null) {
      return;
    }

    this.cancellingOrderId = orderId;

    this.userApi
      .cancelOrder(orderId)
      .pipe(

        finalize(() => {

          this.cancellingOrderId = null;

        })

      )
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.toastr.success(
              res.message ||
              'Order Cancelled..!',
              'Success',
              {
                disableTimeOut: false,
                progressBar: true,
                closeButton: true
              }
            );

            // Refresh order list after cancellation

            this.loadOrders();

          } else {

            this.toastr.error(
              'Failed to cancel order.',
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
            'Error canceling order:',
            error
          );

          this.toastr.error(
            'Something went wrong.',
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

}