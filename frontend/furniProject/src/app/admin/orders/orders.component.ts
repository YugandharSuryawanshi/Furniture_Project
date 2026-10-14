import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  paginatedOrders: any[] = [];

  selectedStatus: string = 'All';
  searchQuery: string = '';
  selectedDateFilter: string = 'Every Day';

  // Counters
  total_orders: number = 0;
  total_pending: number = 0;
  total_revenue: number = 0;
  total_cancelled: number = 0;
  total_delivered: number = 0;

  animatedTotalRevenue: number = 0;
  animatedTotalOrder: number = 0;

  // Pagination
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  // Order Details
  showTracking: boolean = false;
  singleOrderDetails: any = null;
  showOrderDetails: boolean = false;

  // Skeleton Loading
  isLoading: boolean = true;
  isOrderDetailsLoading: boolean = false;

  // Minimum skeleton display time
  private readonly skeletonMinimumTime = 700;

  constructor(
    private adminApi: AdminApiService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;

    const startTime = Date.now();

    this.adminApi.getOrders()
      .pipe(
        finalize(() => {
          this.hideSkeletonAfterMinimumTime(startTime);
        })
      )
      .subscribe({
        next: (res: any) => {

          if (res?.success) {
            this.orders = Array.isArray(res.data) ? res.data : [];

            this.calculateOrderTotals();

            this.animateCounter();
            this.animateOrderCounter();

            this.applyFilters();

          } else {
            this.orders = [];
            this.filteredOrders = [];
            this.paginatedOrders = [];

            this.toastr.error(
              'No orders found',
              'Error',
              {
                progressBar: true,
                closeButton: true,
                disableTimeOut: false
              }
            );
          }
        },

        error: (error) => {
          console.error('Error fetching orders:', error);

          this.orders = [];
          this.filteredOrders = [];
          this.paginatedOrders = [];

          this.toastr.error(
            'Error fetching orders',
            'Error',
            {
              progressBar: true,
              closeButton: true,
              disableTimeOut: false
            }
          );
        }
      });
  }

  private hideSkeletonAfterMinimumTime(startTime: number): void {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(
      this.skeletonMinimumTime - elapsedTime,
      0
    );

    setTimeout(() => {
      this.isLoading = false;
    }, remainingTime);
  }

  private calculateOrderTotals(): void {
    this.total_orders = this.orders.length;
    this.total_pending = 0;
    this.total_revenue = 0;
    this.total_cancelled = 0;
    this.total_delivered = 0;

    this.orders.forEach(order => {

      this.total_revenue += parseFloat(order?.final_total) || 0;

      if (order?.order_status === 'Pending') {
        this.total_pending++;
      }

      if (order?.order_status === 'Cancelled') {
        this.total_cancelled++;
      }

      if (order?.order_status === 'Delivered') {
        this.total_delivered++;
      }
    });
  }

  animateCounter(): void {
    let start = 0;
    const end = this.total_revenue;

    this.animatedTotalRevenue = 0;

    if (end <= 0) {
      this.animatedTotalRevenue = 0;
      return;
    }

    const duration = 1500;
    const increment = Math.ceil(end / (duration / 20));

    const timer = setInterval(() => {

      if (start < end) {
        start += increment;

        if (start > end) {
          start = end;
        }

        this.animatedTotalRevenue = start;
      } else {
        this.animatedTotalRevenue = end;
        clearInterval(timer);
      }

    }, 10);
  }

  animateOrderCounter(): void {
    let start = 0;
    const end = this.total_orders;

    this.animatedTotalOrder = 0;

    if (end <= 0) {
      this.animatedTotalOrder = 0;
      return;
    }

    const duration = 2500;
    const increment = Math.max(
      Math.ceil(end / (duration / 20)),
      1
    );

    const timer = setInterval(() => {

      if (start < end) {
        start += increment;

        if (start > end) {
          start = end;
        }

        this.animatedTotalOrder = start;
      } else {
        this.animatedTotalOrder = end;
        clearInterval(timer);
      }

    }, 60);
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  setDateFilter(filter: string): void {
    this.selectedDateFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {

    let filtered = [...this.orders];

    // Status filter
    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(
        order => order?.order_status === this.selectedStatus
      );
    }

    // Date filter
    const today = new Date();

    filtered = filtered.filter(order => {

      if (!order?.order_date) {
        return this.selectedDateFilter === 'Every Day';
      }

      const orderDate = new Date(order.order_date);

      if (this.selectedDateFilter === 'Today') {
        return orderDate.toDateString() === today.toDateString();
      }

      if (this.selectedDateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        return orderDate >= sevenDaysAgo;
      }

      if (this.selectedDateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return orderDate >= thirtyDaysAgo;
      }

      return true;
    });

    // Search filter
    if (this.searchQuery.trim() !== '') {

      const searchLower = this.searchQuery
        .trim()
        .toLowerCase();

      filtered = filtered.filter(order => {

        const products = String(order?.products || '').toLowerCase();
        const firstName = String(order?.c_fname || '').toLowerCase();
        const lastName = String(order?.c_lname || '').toLowerCase();
        const userName = String(order?.user_name || '').toLowerCase();
        const orderId = String(order?.order_id || '').toLowerCase();

        return (
          products.includes(searchLower) ||
          firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          userName.includes(searchLower) ||
          orderId.includes(searchLower)
        );
      });
    }

    this.filteredOrders = filtered;

    // Reset pagination after filters/search
    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredOrders.length / this.itemsPerPage
    );

    this.totalPagesArray = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    this.paginateOrders();
  }

  paginateOrders(): void {

    const startIndex =
      (this.currentPage - 1) * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    this.paginatedOrders =
      this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages &&
      page !== this.currentPage
    ) {
      this.currentPage = page;
      this.paginateOrders();
    }
  }

  // View Order Details
  viewOrderDetails(id: any): void {

    this.showTracking = true;
    this.showOrderDetails = false;
    this.singleOrderDetails = null;
    this.isOrderDetailsLoading = true;

    const startTime = Date.now();

    this.adminApi.getSingleOrder(id)
      .pipe(
        finalize(() => {

          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(
            this.skeletonMinimumTime - elapsedTime,
            0
          );

          setTimeout(() => {
            this.isOrderDetailsLoading = false;
          }, remainingTime);
        })
      )
      .subscribe({
        next: (res: any) => {

          if (res?.success) {
            this.singleOrderDetails = res.data;
            this.showOrderDetails = true;
          } else {
            this.toastr.error(
              'No order found',
              'Error',
              {
                progressBar: true,
                closeButton: true,
                disableTimeOut: false
              }
            );
          }
        },

        error: (error) => {
          console.error(
            'Error fetching order details:',
            error
          );

          this.toastr.error(
            'Error fetching order details',
            'Error',
            {
              progressBar: true,
              closeButton: true,
              disableTimeOut: false
            }
          );
        }
      });
  }

  getInitials(name: string): string {

    if (!name) {
      return '';
    }

    const nameParts = name
      .trim()
      .split(/\s+/);

    return nameParts
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getProducts(products: any): string[] {

    if (!products) {
      return [];
    }

    return String(products)
      .split(', ')
      .filter(product => product.trim() !== '');
  }

  closeOrderDetails(): void {
    this.showTracking = false;
    this.showOrderDetails = false;
    this.singleOrderDetails = null;
    this.isOrderDetailsLoading = false;
  }
}