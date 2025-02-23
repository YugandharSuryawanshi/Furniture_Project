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

  orders: any[] = []; // All orders
  filteredOrders: any[] = []; // Filtered orders
  paginatedOrders: any[] = []; // Displayed orders (pagination)
  selectedStatus: string = 'All';
  searchQuery: string = '';
  selectedDateFilter: string = 'Every';

  // Summary Counters
  total_orders: number = 0;
  total_pending: number = 0;
  total_revenue: number = 0;
  total_cancelled: number = 0;
  total_delivered: number = 0;

  // Pagination
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  // Show hide order Details
  showTracking: boolean = false;
  singleOrderDetails:any; // Store the selected order details
  showOrderDetails: boolean = false; // Toggle visibility

  constructor(private adminApi: AdminApiService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminApi.getOrders().subscribe((res: any) => {
      if (res.success) {
        this.orders = res.data;
        console.log('Orders fetched successfully', this.orders);
        
        this.total_orders = this.orders.length;
        this.total_pending = 0;
        this.total_revenue = 0;
        this.total_cancelled = 0;
        this.total_delivered = 0;

        // Calculate totals
        this.orders.forEach(order => {
          this.total_revenue += parseFloat(order.final_total) || 0;
          if (order.order_status === 'Pending') this.total_pending++;
          if (order.order_status === 'Cancelled') this.total_cancelled++;
          if (order.order_status === 'Delivered') this.total_delivered++;
        });

        this.applyFilters(); // Apply filters and pagination
      } else {
        this.toastr.error('No orders found', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
      }
    }, error => {
      console.error("Error fetching orders:", error);
      this.toastr.error('Error fetching orders', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
    });
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  setDateFilter(filter: string) {
    this.selectedDateFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.orders];

    // Filter by order status
    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(order => order.order_status === this.selectedStatus);
    }

    // Filter by date range
    const today = new Date();
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.order_date);
      if (this.selectedDateFilter === 'Today') {
        return orderDate.toDateString() === today.toDateString();
      } else if (this.selectedDateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      } else if (this.selectedDateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }
      return true;
    });

    // Apply search filter
    if (this.searchQuery.trim() !== '') {
      const searchLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.products?.toLowerCase().includes(searchLower) ||
        order.c_fname?.toLowerCase().includes(searchLower) ||
        order.c_lname?.toLowerCase().includes(searchLower) ||
        order.user_name?.toLowerCase().includes(searchLower) ||
        order.order_id?.toString().includes(searchLower)
      );
    }

    this.filteredOrders = filtered; // Store filtered results

    // Update pagination
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateOrders();
  }

  paginateOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateOrders();
    }
  }

  // Function to set selected order details
  // View order details
  viewOrderDetails(id: any) {
    this.showTracking = true;
    this.adminApi.getSingleOrder(id).subscribe((res: any) => {
      if (res.success) {
        this.singleOrderDetails = res.data;
        console.log('Order details fetched successfully', this.singleOrderDetails);
        this.showOrderDetails = true;
      } else {
        this.toastr.error('No order found', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
      }
    })
  }

  closeOrderDetails() {
    this.showTracking = false;
  }




}
