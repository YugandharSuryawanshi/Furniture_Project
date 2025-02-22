import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'All';
  searchQuery: string = '';
  selectedDateFilter: string = 'Every';

  // Summary Counters
  total_orders: number = 0;
  total_pending: number = 0;
  total_revenue: number = 0;
  total_cancelled: number = 0;
  total_delivered: number = 0;

  // Order Details (For Modal)
  orderDetails: any = null;
  subtotal: number = 0;
  gst: number = 0;
  discount: number = 0;

  constructor(private adminApi: AdminApiService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminApi.getOrders().subscribe((res: any) => {
      if (res.success) {
        this.orders = res.data;

        // Reset all variable before calculations
        this.total_orders = this.orders.length;
        this.total_pending = 0;
        this.total_revenue = 0;
        this.total_cancelled = 0;
        this.total_delivered = 0;

        // calculate totals
        this.orders.forEach(order => {
          this.total_revenue += parseFloat(order.final_total) || 0;

          // Count order statuses
          if (order.order_status === 'Pending') this.total_pending++;
          if (order.order_status === 'Cancelled') this.total_cancelled++;
          if (order.order_status === 'Delivered') this.total_delivered++;
        });

        this.applyFilters();

      } else {
        this.toastr.error('No orders found', 'Error', { progressBar : true, closeButton: true, disableTimeOut: false});
      }
    }, error => {
      console.error("Error fetching orders:", error);
      this.toastr.error('Error fetching orders', 'Error', { progressBar : true, closeButton: true, disableTimeOut: false});
    });
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.filterOrders();
}

applyFilters() {
  this.filterOrders();
  this.searchOrders();
}

filterOrders() {
  if (!this.orders || this.orders.length === 0) {
      this.filteredOrders = [];
      return;
  }

  this.filteredOrders = this.orders.filter(order => {
      const statusMatch = this.selectedStatus === 'All' || order.order_status === this.selectedStatus;

      const orderDate = new Date(order.order_date);
      const today = new Date();
      let dateFilterMatch = true;

      if (this.selectedDateFilter === 'Today') {
          dateFilterMatch = orderDate.toDateString() === today.toDateString();
      } else if (this.selectedDateFilter === 'Last 7 Days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          dateFilterMatch = orderDate >= sevenDaysAgo;
      } else if (this.selectedDateFilter === 'Last 30 Days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          dateFilterMatch = orderDate >= thirtyDaysAgo;
      }

      return statusMatch && dateFilterMatch;
  });
}

// Function to search orders by Order ID, Customer Name, or Products
searchOrders() {
  const searchLower = this.searchQuery?.toLowerCase() || '';
  if (!searchLower) return;

  this.filteredOrders = this.filteredOrders.filter(order =>
      order.products?.toLowerCase().includes(searchLower) ||
      order.c_fname?.toLowerCase().includes(searchLower) ||
      order.c_lname?.toLowerCase().includes(searchLower) ||
      order.order_id?.toString().includes(searchLower)  // Convert Order ID to string
  );
}



  



}
