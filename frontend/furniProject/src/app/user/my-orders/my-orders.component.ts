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

  subtotal: number = 0;
  gst: number = 0;
  discount: number = 0;
  total_amt: number = 0;

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
          console.log('Orders fetched successfully:', this.orders);
          
          // Calculate totals for each order
          this.orders.forEach(order => {
            this.calculateTotals(order); // Calculate totals for each order
          });
        } else {
          this.toastr.error('Failed to fetch orders.', 'Error', { disableTimeOut: false, closeButton: true });
        }
      },
      (error) => {
        console.error("Error fetching orders:", error);
        this.toastr.error('Something went wrong while fetching your orders.', 'Error', { disableTimeOut: false, closeButton: true });
      }
    );
  }
  

  calculateTotals(order: any) {
    // ✅ Use `order.total_amt` as the subtotal
    const subtotal = order.total_amt; // Subtotal before discount and GST
  
    // ✅ Apply 12% GST on subtotal
    order.gst = subtotal * 0.12;
  
    // ✅ Apply 20% discount on subtotal
    order.discount = subtotal * 0.20;
  
    // ✅ Correct total calculation: Subtotal + GST - Discount
    order.total_amt = Math.round(subtotal + (order.gst - order.discount));
  }
  



  openTrackingModal(orderId: number, orderStatus: string) {
    if (orderStatus === 'Cancelled') {
      this.toastr.warning("This order has been canceled. Tracking is unavailable.", 'warning', { disableTimeOut: false, closeButton: true });
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
          this.toastr.error('Failed to fetch order status.', 'error', { disableTimeOut: false, closeButton: true });
        }
      },
      (error) => {
        console.error('Error to tracking order:', error);
        this.toastr.error('Something went wrong.', 'error', { disableTimeOut: false, closeButton: true });
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
          this.toastr.success(res.message, 'Success', { disableTimeOut: false, closeButton: true });
          this.loadOrders();
        } else {
          this.toastr.error('Failed to cancel order.', 'error', { disableTimeOut: false, closeButton: true });
        }
      },
      (error) => {
        console.error('Error canceling order:', error);
        this.toastr.error('Something went wrong.', 'error', { disableTimeOut: false, closeButton: true });
      }
    );
  }

}
