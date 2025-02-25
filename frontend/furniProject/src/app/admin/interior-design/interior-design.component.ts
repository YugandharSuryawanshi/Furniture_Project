import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-interior-design',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './interior-design.component.html',
  styleUrl: './interior-design.component.css'
})
export class InteriorDesignComponent implements OnInit{
  formData = {
    heading: '',
    interior_details: '',
    first_key: '',
    second_key: '',
    third_key: '',
    forth_key: '',
    first_image: '',
    second_image: '',
    third_image: '',
  };

  // Object to track newly selected images
  selectedImages: { [key: string]: File | null } = {
    first_image: null,
    second_image: null,
    third_image: null,
  };

  constructor(private adminApi:AdminApiService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.adminApi.getInterior().subscribe(
      (res: any) => {
        this.formData = res.data;
      },
      (err: any) => {
        console.error('Error fetching data:', err);
      }
    );
  }

  // Handle file selection dynamically
  onFileSelected(event: any, key: string): void {
    const file = event.target.files[0];
    
    if (file) {
      this.selectedImages[key] = file;
    }
  }
  
  // Submit the form
  onSubmit(): void {
    const formData = new FormData();
  
    // Append text fields
    formData.append('heading', this.formData.heading);
    formData.append('interior_details', this.formData.interior_details);
    formData.append('first_key', this.formData.first_key);
    formData.append('second_key', this.formData.second_key);
    formData.append('third_key', this.formData.third_key);
    formData.append('forth_key', this.formData.forth_key);
  
    // Check and append images if new files are selected
    if (this.selectedImages['first_image']) {
      formData.append('first_image', this.selectedImages['first_image'] as File);
    }
  
    if (this.selectedImages['second_image']) {
      formData.append('second_image', this.selectedImages['second_image'] as File);
    }
  
    if (this.selectedImages['third_image']) {
      formData.append('third_image', this.selectedImages['third_image'] as File);
    }
  
    // Call API to update interior design
    this.adminApi.updateInterior(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Interior Design updated successfully!', 'Success', { progressBar: true, closeButton: true, disableTimeOut: false });
        this.getData(); // Fetch the updated data after successful submission
      }
      else
      {
        this.toastr.error('Failed to update interior design!', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
      }
    });
  }
  

}

