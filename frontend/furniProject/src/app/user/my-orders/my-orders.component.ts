import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../service/user-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {

  orders: any[] = [];
  showTracking: boolean = false;
  trackingOrderId: number | null = null;
  trackingProgress: number = 0;
  trackingStatus: string = '';

  trackingSteps = [
    { label: "Order Placed", progress: 10, icon: "fas fa-box" },
    { label: "Confirmed", progress: 30, icon: "fas fa-check-circle" },
    { label: "Dispatched", progress: 50, icon: "fas fa-truck" },
    { label: "Out for Delivery", progress: 80, icon: "fas fa-shipping-fast" },
    { label: "Delivered", progress: 100, icon: "fas fa-home" }
  ];

  constructor(private userApi: UserApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.userApi.getMyOrders().subscribe(
      (res: any) => {
        if (res.success) {
          this.orders = res.orders;
        } else {
          this.toastr.error('Failed to fetch orders.', 'Error', { disableTimeOut: false, progressBar:true , closeButton: true });
        }
      },
      (error) => {
        console.error("Error fetching orders:", error);
        this.toastr.error('Something went wrong while fetching your orders.', 'Error', { disableTimeOut: false, progressBar:true , closeButton: true });
      }
    );
  }


  openTrackingModal(orderId: number, orderStatus: string) {
    if (orderStatus === 'Cancelled') {
      this.toastr.warning("This order has been canceled. Tracking is unavailable.", 'warning', { disableTimeOut: false, progressBar:true , closeButton: true });
      return;
    }

    this.showTracking = true;
    this.trackingOrderId = orderId;
    this.userApi.getOrderTracking(orderId).subscribe(
      (res: any) => {
        if (res.success) {
          this.trackingProgress = res.progress;
          this.trackingStatus = res.order_status;
        } else {
          this.toastr.error('Failed to fetch order status.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
        }
      },
      (error) => {
        console.error('Error to tracking order:', error);
        this.toastr.error('Something went wrong.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
      }
    );
  }

  closeTrackingModal() {
    this.showTracking = false;
  }

  cancelOrder(orderId: number) {
    this.userApi.cancelOrder(orderId).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success', { disableTimeOut: false, progressBar:true , closeButton: true });
          this.loadOrders();
        } else {
          this.toastr.error('Failed to cancel order.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
        }
      },
      (error) => {
        console.error('Error canceling order:', error);
        this.toastr.error('Something went wrong.', 'error', { disableTimeOut: false, progressBar:true , closeButton: true });
      }
    );
  }

}
