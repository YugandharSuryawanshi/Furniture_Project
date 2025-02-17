import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-interior-design',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './interior-design.component.html',
  styleUrl: './interior-design.component.css'
})
export class InteriorDesignComponent {
  errorMessage: string = '';
  successMessage: string = '';

  // Form data with placeholders for pre-filled values
  formData = {
    heading: '',
    interior_details: '',
    first_key: '',
    second_key: '',
    third_key: '',
    forth_key: '',
    first_image: '', // Existing image path
    second_image: '', // Existing image path
    third_image: '', // Existing image path
  };

  // Object to track newly selected images
  selectedImages: { [key: string]: File | null } = {
    first_image: null,
    second_image: null,
    third_image: null,
  };

  constructor(public adminApi:AdminApiService) { }

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
      this.selectedImages[key] = file; // Store the newly selected file
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
        this.successMessage = res.message;
        this.getData(); // Fetch the updated data after successful submission
      }
      else
      {
        this.errorMessage = res.message;
      }
      setTimeout(()=>{
        this.errorMessage = '';
        this.successMessage = '';
      }, 5000);
    });
  }
  

}

