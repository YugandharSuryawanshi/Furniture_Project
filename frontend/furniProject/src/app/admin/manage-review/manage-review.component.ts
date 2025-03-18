import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-manage-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-review.component.html',
  styleUrl: './manage-review.component.css'
})
export class ManageReviewComponent implements OnInit {

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  reviews: any[] = [];
  paginatedReviews: any[] = [];
  // Pagination Variables
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews() {
    this.adminApi.getReviews().subscribe((res: any) => {
      if (res.success) {
        this.reviews = res.data;
        this.updatePagination();  // Call pagination after fetching data
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.reviews.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateReviews();
  }

  paginateReviews() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReviews = this.reviews.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateReviews();
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
    return initials;
  }

  selectedReview: any = null;

  openEditModal(review: any) {
    this.selectedReview = review;
    this.selectedReview.review_images = review.review_img ? review.review_img.split(',') : [];
    console.log(this.selectedReview);
  }

  closeModal() {
    this.selectedReview = null;
  }

  formData = {
    rating: '',
    comment: '',
    heading: '',
    review_id: '',
  };

  saveReview(id:any)
  {
    const formData =  new FormData();
    formData.append('rating', this.formData.rating);
    formData.append('comment', this.formData.comment);
    formData.append('heading', this.formData.heading);
    formData.append('review_id', id);
    this.adminApi.updateReview(formData).subscribe((res:any)=>{
      if(res.success)
      {
        this.toastr.success(res.message || 'Review Updated Successfully', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getReviews();
        this.closeModal();
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  deleteReview(id: any)
  {
    this.adminApi.deleteReview(id).subscribe((res:any)=>{
      if(res.success)
      {
        this.toastr.success(res.message || 'Review Deleted Successfully', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getReviews();
      } else {
        this.toastr.error(res.message);
      }
    })
  }


}
