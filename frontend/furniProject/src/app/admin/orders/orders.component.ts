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

    orderDetails: any = null;
    subtotal: number = 0;
    gst: number = 0;
    discount: number = 0;

  constructor(private adminApi: AdminApiService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }


  fetchOrders() {
    this.adminApi.getOrders().subscribe((res: any) => {
      if (res.success) {
        this.orders = res.data.map((order: any) => {
          order.total_amt = this.calculateTotal(order.total_amount);  // Store total in each order
          return order;
        });
        this.applyFilters();

      } else {
        this.toastr.error('No orders found', 'Error');
      }
    }, error => {
      console.error("Error fetching orders:", error);
      this.toastr.error('Error fetching orders', 'Error');
    });
}



  calculateTotal(subtotal: number): number {
    if (!subtotal) return 0;

    const gst = subtotal * 0.12;   // 12% GST
    const discount = subtotal * 0.20;  // 20% Discount
    return Math.round(subtotal + gst - discount);
}

  setStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      // Convert search query to lowercase for case-insensitive search
      const searchLower = this.searchQuery.toLowerCase();
      
      // Check if any field matches the search query
      const statusMatch = (this.selectedStatus === 'All' || order.order_status === this.selectedStatus);
      const productMatch = order.products?.toLowerCase().includes(searchLower);
      const firstNameMatch = order.c_fname?.toLowerCase().includes(searchLower);
      const lastNameMatch = order.c_lname?.toLowerCase().includes(searchLower);
      const orderIdMatch = order.order_id?.toString().includes(searchLower);  // Convert number to string

      // Combine all search conditions
      const searchMatch = this.searchQuery === '' || productMatch || firstNameMatch || lastNameMatch || orderIdMatch;

      // Date Filtering Logic
      const today = new Date();
      const orderDate = new Date(order.order_date);
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

      return statusMatch && searchMatch && dateFilterMatch;
    });
}



}
