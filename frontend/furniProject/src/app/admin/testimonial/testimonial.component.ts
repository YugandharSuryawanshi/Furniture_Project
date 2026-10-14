
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css'
})
export class TestimonialComponent implements OnInit {

  constructor(
    private adminApi: AdminApiService,
    private toastr: ToastrService
  ) { }

  displayAdd = true;
  displayList = false;
  displayUpdate = false;

  testimonials: any[] = [];

  selectedImage: File | null = null;
  HideImage = true;

  // Page-specific loading states
  loadingTestimonials = false;
  loadingTestimonialDetails = false;
  savingTestimonial = false;
  updatingTestimonial = false;
  deletingTestimonialId: string | number | null = null;

  private listRequestId = 0;
  private detailsRequestId = 0;

  readonly basePath = 'http://localhost:4000/uploads/';

  formData: any = this.createEmptyForm();

  ngOnInit(): void {
    // Preserve the existing initial API request.
    this.getAllTestimonials();
  }

  private createEmptyForm(): any {
    return {
      customer_id: '',
      customer_name: '',
      customer_position: '',
      customer_massage: '',
      customer_image: null
    };
  }

  private showListSkeletonForMinimumTime(
    startedAt: number,
    requestId: number
  ): void {
    const remainingTime = Math.max(
      0,
      700 - (Date.now() - startedAt)
    );

    setTimeout(() => {
      if (requestId === this.listRequestId) {
        this.loadingTestimonials = false;
      }
    }, remainingTime);
  }

  // ADD TESTIMONIAL VIEW
  display1(): void {
    this.displayAdd = true;
    this.displayList = false;
    this.displayUpdate = false;
    this.HideImage = false;

    this.formData = this.createEmptyForm();
    this.selectedImage = null;
  }

  // SHOW TESTIMONIAL LIST
  display2(): void {
    this.displayAdd = false;
    this.displayList = true;
    this.displayUpdate = false;

    this.getAllTestimonials();
  }

  // CANCEL EDIT AND RETURN TO LIST
  display3(): void {
    this.displayUpdate = false;
    this.displayAdd = false;
    this.displayList = true;
    this.HideImage = false;

    this.formData = this.createEmptyForm();
    this.selectedImage = null;

    this.getAllTestimonials();
  }

  // SELECT IMAGE FOR NEW TESTIMONIAL
  onSelectedImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastr.error(
        'Please select a valid image.',
        'Invalid File',
        {
          progressBar: true,
          closeButton: true,
          disableTimeOut: false
        }
      );

      input.value = '';
      return;
    }

    this.selectedImage = file;
    this.formData.customer_image = file;
  }

  // SAVE NEW TESTIMONIAL
  saveTestimonial(): void {
    if (this.savingTestimonial) {
      return;
    }

    if (
      !this.formData.customer_name?.trim() ||
      !this.formData.customer_position?.trim() ||
      !this.formData.customer_massage?.trim()
    ) {
      this.toastr.warning(
        'Please fill in all testimonial details.',
        'Required Fields',
        {
          progressBar: true,
          closeButton: true,
          disableTimeOut: false
        }
      );
      return;
    }

    if (!this.selectedImage) {
      this.toastr.warning(
        'Please select a customer image.',
        'Image Required',
        {
          progressBar: true,
          closeButton: true,
          disableTimeOut: false
        }
      );
      return;
    }

    const payload = new FormData();

    payload.append('customer_name', this.formData.customer_name.trim());
    payload.append('customer_position', this.formData.customer_position.trim());
    payload.append('customer_massage', this.formData.customer_massage.trim());
    payload.append(
      'customer_image',
      this.selectedImage,
      this.selectedImage.name
    );

    this.savingTestimonial = true;

    this.adminApi.saveTestimonial(payload)
      .pipe(
        finalize(() => {
          this.savingTestimonial = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              res.message || 'Testimonial Saved Successfully',
              'Success',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            this.formData = this.createEmptyForm();
            this.selectedImage = null;

            this.getAllTestimonials();
          } else {
            this.toastr.error(
              res?.message || 'Unable to save testimonial.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }
        },
        error: (error: any) => {
          console.error('Error saving testimonial:', error);

          this.toastr.error(
            error?.error?.message || 'Error saving testimonial data.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }

  // FETCH ALL TESTIMONIALS
  getAllTestimonials(): void {
    const startedAt = Date.now();
    const requestId = ++this.listRequestId;

    this.loadingTestimonials = true;

    this.adminApi.getTestimonials()
      .pipe(
        finalize(() => {
          this.showListSkeletonForMinimumTime(startedAt, requestId);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.testimonials = res.data ?? [];
          } else {
            this.testimonials = [];

            this.toastr.error(
              res?.message || 'Unable to fetch testimonials.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }
        },
        error: (error: any) => {
          console.error('Error fetching testimonials:', error);
          this.testimonials = [];

          this.toastr.error(
            error?.error?.message || 'Error fetching testimonials.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }

  // FETCH A TESTIMONIAL FOR EDITING
  get_This_Product(id: any): void {
    this.displayAdd = false;
    this.displayList = false;
    this.displayUpdate = true;
    this.HideImage = true;

    this.loadingTestimonialDetails = true;
    this.selectedImage = null;

    const requestId = ++this.detailsRequestId;

    this.adminApi.getOneTestimonial(id)
      .pipe(
        finalize(() => {
          if (requestId === this.detailsRequestId) {
            this.loadingTestimonialDetails = false;
          }
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success && res.data) {
            this.formData = {
              ...this.createEmptyForm(),
              ...res.data
            };

            this.HideImage = true;
          } else {
            this.toastr.error(
              res?.message || 'Unable to fetch testimonial.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            this.displayUpdate = false;
            this.displayList = true;
          }
        },
        error: (error: any) => {
          console.error('Error fetching testimonial details:', error);

          this.toastr.error(
            error?.error?.message || 'Error fetching testimonial details.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );

          this.displayUpdate = false;
          this.displayList = true;
        }
      });
  }

  // SELECT REPLACEMENT IMAGE WHILE EDITING
  onSelectedUpdateImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastr.error(
        'Please select a valid image.',
        'Invalid File',
        {
          progressBar: true,
          closeButton: true,
          disableTimeOut: false
        }
      );

      input.value = '';
      return;
    }

    this.selectedImage = file;
    this.HideImage = false;
  }

  // UPDATE EXISTING TESTIMONIAL
  updateTestimonial(): void {
    if (this.updatingTestimonial) {
      return;
    }

    if (
      !this.formData.customer_name?.trim() ||
      !this.formData.customer_position?.trim() ||
      !this.formData.customer_massage?.trim()
    ) {
      this.toastr.warning(
        'Please fill in all testimonial details.',
        'Required Fields',
        {
          progressBar: true,
          closeButton: true,
          disableTimeOut: false
        }
      );
      return;
    }

    const payload = new FormData();

    payload.append('customer_name', this.formData.customer_name.trim());
    payload.append('customer_position', this.formData.customer_position.trim());
    payload.append('customer_massage', this.formData.customer_massage.trim());

    if (this.selectedImage) {
      payload.append(
        'customer_image',
        this.selectedImage,
        this.selectedImage.name
      );
    }

    this.updatingTestimonial = true;

    this.adminApi.updateTestimonial(
      this.formData.customer_id,
      payload
    )
      .pipe(
        finalize(() => {
          this.updatingTestimonial = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              res.message || 'Testimonial Updated Successfully',
              'Success',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            this.formData = this.createEmptyForm();
            this.selectedImage = null;

            this.displayAdd = false;
            this.displayList = true;
            this.displayUpdate = false;
            this.HideImage = false;

            this.getAllTestimonials();
          } else {
            this.toastr.error(
              res?.message || 'Unable to update testimonial.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }
        },
        error: (error: any) => {
          console.error('Error updating testimonial:', error);

          this.toastr.error(
            error?.error?.message || 'Error updating testimonial data.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }

  // DELETE TESTIMONIAL
  deleteProduct(id: any): void {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    if (this.deletingTestimonialId !== null) {
      return;
    }

    this.deletingTestimonialId = id;

    this.adminApi.deleteTestimonial(id)
      .pipe(
        finalize(() => {
          this.deletingTestimonialId = null;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.toastr.success(
              res.message || 'Testimonial Deleted Successfully',
              'Success',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            this.getAllTestimonials();
          } else {
            this.toastr.error(
              res?.message || 'Unable to delete testimonial.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }
        },
        error: (error: any) => {
          console.error('Error deleting testimonial:', error);

          this.toastr.error(
            error?.error?.message || 'Error deleting testimonial.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }
}
