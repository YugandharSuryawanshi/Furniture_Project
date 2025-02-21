import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';

interface Order {
  _id: string;
  orderId: string;
  c_fname: string;
  c_lname: string;
  order_date: Date;
  total_amt: number;
  order_status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

@Component({
  selector: 'app-update-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery: string = '';
  statusFilter: string = '';
  dateFilter: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Stats
  stats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  };

  constructor(
    private adminApi: AdminApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminApi.getOrders().subscribe((res: any) => {
      if (res.success) {
        this.orders = res.data;
        this.filteredOrders = [...this.orders];
        console.log(this.filteredOrders);
        
        
        this.calculateStats(this.filteredOrders);
        this.applyFilters();
      } else {
        this.toastr.error('No orders found', 'Error');
      }
    }, error => {
      console.error("Error fetching orders:", error);
      this.toastr.error('Error fetching orders', 'Error');
    });
  }

  calculateStats(orders: Order[]) {
    this.stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total_amt, 0),
      pendingOrders: orders.filter(order => order.order_status === 'Pending').length,
      deliveredOrders: orders.filter(order => order.order_status === 'Delivered').length
    };
  }
  
  // In the applyFilters method:
  

  applyFilters() {
    let tempOrders = [...this.orders];

    // Apply search filter
    if (this.searchQuery) {
      const searchLower = this.searchQuery.toLowerCase();
      tempOrders = tempOrders.filter(order =>
        order.c_fname.toLowerCase().includes(searchLower) ||
        order.c_lname.toLowerCase().includes(searchLower) ||
        order.orderId.includes(this.searchQuery)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      tempOrders = tempOrders.filter(order => order.order_status === this.statusFilter);
    }

    // Apply date filter
    if (this.dateFilter) {
      const today = new Date();
      tempOrders = tempOrders.filter(order => {
        const orderDate = new Date(order.order_date);
        switch (this.dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'week':
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            return orderDate >= sevenDaysAgo;
          case 'month':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    this.filteredOrders = tempOrders;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
  }

  onSearchChange(searchValue: string): void {
    this.searchQuery = searchValue;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onDateFilterChange(filter: string): void {
    this.dateFilter = filter;
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Processing':
        return 'bg-info text-white';
      case 'Shipped':
        return 'bg-primary text-white';
      case 'Delivered':
        return 'bg-success text-white';
      case 'Cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    // this.adminApi.updateOrderStatus(orderId, newStatus).subscribe({
    //   next: (res) => {
    //     if (res.success) {
    //       const index = this.orders.findIndex(o => o._id === orderId);
    //       if (index > -1) {
    //         this.orders[index].order_status = newStatus;
    //         this.applyFilters();
    //         this.toastr.success('Order status updated', 'Success');
    //       }
    //     }
    //   },
    //   error: (err) => {
    //     this.toastr.error('Failed to update status', 'Error');
    //     console.error('Update error:', err);
    //   }
    // });
  }

  deleteOrder(orderId: string) {
  //   if (confirm('Are you sure you want to delete this order?')) {
  //     this.adminApi.deleteOrder(orderId).subscribe({
  //       next: (res) => {
  //         if (res.success) {
  //           this.orders = this.orders.filter(o => o._id !== orderId);
  //           this.applyFilters();
  //           this.toastr.success('Order deleted', 'Success');
  //         }
  //       },
  //       error: (err) => {
  //         this.toastr.error('Failed to delete order', 'Error');
  //         console.error('Delete error:', err);
  //       }
  //     });
  //   }
  }

}