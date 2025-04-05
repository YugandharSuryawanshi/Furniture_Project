import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../service/admin-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-wishlist.component.html',
  styleUrl: './manage-wishlist.component.css'
})
export class ManageWishlistComponent implements OnInit {

  wishlist: any[] = [];
  filteredWishlist: any[] = [];
  paginatedWishlist: any[] = [];
  wishlist_count: number = 0;
  highPriorityCount: number = 0;
  catData: any[] = [];
  categories: string[] = [];
  selectedCategory: string = "";
  selectedPriority: string = "";
  searchText: string = "";
  selectedProduct: any = null;

  // Pagination
  pageSize: number = 5;
  currentPage: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadWishlist();
    this.loadCategoryList();
  }

  loadWishlist(): void {
    this.adminApi.getAllWishlist().subscribe((data: any) => {
      this.wishlist = data.data;
      this.wishlist_count = this.wishlist.length;
      this.calculatePriorities();
      this.applyFilters();
    });
  }

  loadCategoryList(): void {
    this.adminApi.getProductTypes().subscribe((data: any) => {
      this.catData = data.product_types;
      this.categories = this.catData.map((item: any) => item.product_type_name);
    });
  }

  getUserInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      return nameParts[0][0].toUpperCase();
    }
  }

  calculatePriorities(): void {
    const priorityMap = new Map<string, number>();

    // Count occurrences of each product_type_name
    this.wishlist.forEach(item => {
      priorityMap.set(item.product_type_name, (priorityMap.get(item.product_type_name) || 0) + 1);
    });

    // Sort by highest occurrence
    const sortedPriorities = Array.from(priorityMap.entries()).sort((a, b) => b[1] - a[1]);

    // Assign priority levels
    let priorityLevels = new Map<string, string>();
    if (sortedPriorities.length > 0) priorityLevels.set(sortedPriorities[0][0], "High");
    if (sortedPriorities.length > 1) priorityLevels.set(sortedPriorities[1][0], "Medium");
    if (sortedPriorities.length > 2) {
      for (let i = 2; i < sortedPriorities.length; i++) {
        priorityLevels.set(sortedPriorities[i][0], "Low");
      }
    }

    // Assign calculated priorities to wishlist items
    this.wishlist.forEach(item => {
      item.priority = priorityLevels.get(item.product_type_name) || "Low";
    });

    // Count high-priority items
    this.highPriorityCount = this.wishlist.filter(item => item.priority === "High").length;
  }

  applyFilters(): void {
    this.filteredWishlist = this.wishlist.filter(item =>
      (!this.searchText || item.product_name.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedCategory || item.product_type_name === this.selectedCategory) &&
      (!this.selectedPriority || item.priority === this.selectedPriority)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredWishlist.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((_, i) => i);
    this.setPage(0);
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.paginatedWishlist = this.filteredWishlist.slice(page * this.pageSize, (page + 1) * this.pageSize);
  }

  changePage(step: number): void {
    if ((this.currentPage + step) >= 0 && (this.currentPage + step) < this.totalPages) {
      this.setPage(this.currentPage + step);
    }
  }

  openPrompt(product: any): void {
    this.selectedProduct = product;
  }

  closePrompt(): void {
    this.selectedProduct = null;
  }

  showEditComingSoon(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.toastr.info('Edit functionality is coming soon. Not need Right now!', 'Coming Soon', { progressBar: true });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.adminApi.deleteWishlistItem(id).subscribe(() => {
        this.loadWishlist();
      });
    }
  }


}
