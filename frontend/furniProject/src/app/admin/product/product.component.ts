import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  constructor(public adminApi: AdminApiService, public router: Router, private toastr: ToastrService) {
    this.getProductTypes();
  }
  selectedImages: File[] = [];
  selectedImagePreviews: string[] = [];
  productColor: string = '#000000'; // Default color value

  //Get Product Types
  productTypes: any = [];
  getProductTypes() {
    this.adminApi.getProductTypes().subscribe((res: any) => {
      if (res.success) {
        this.productTypes = res.product_types;
      }
    })
  }

  ngOnInit() {
    this.getProductTypes();
  }


  // Handle image selection and preview
  onImageSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const files = Array.from(fileInput.files); // Convert FileList to an array
      this.selectedImages = files; // Store the selected images
      this.selectedImagePreviews = []; // Clear existing previews

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImagePreviews.push(reader.result as string); // Add preview URL
        };
        reader.readAsDataURL(file); // Generate the Base64 preview
      });
    }
  }

  formData =
    {
      product_type_id: '',
      product_name: '',
      product_price: '',
      duplicate_price: '',
      product_size: '',
      product_color: '#000000',
      product_lable: '',
      product_details: '',
      product_image: null,
      product_brand: '',
      product_weight: '',
      no_of_pieces: '',
      product_pattern: '',
      product_origin: '',
      product_material: '',
      product_warranty: '',
      product_care_instructions: '',
      additional_details: '',
      gst_percentage: '',
      discount_percentage: '',
    }

  // Save product

  saveProduct() {
    const formData = new FormData();

    // Append form data fields
    formData.append('product_type_id', this.formData.product_type_id);
    formData.append('product_name', this.formData.product_name);
    formData.append('product_price', this.formData.product_price);
    formData.append('duplicate_price', this.formData.duplicate_price);
    formData.append('product_size', this.formData.product_size);
    formData.append('product_color', this.formData.product_color);
    formData.append('product_lable', this.formData.product_lable);
    formData.append('product_details', this.formData.product_details);
    formData.append('product_brand', this.formData.product_brand);
    formData.append('product_weight', this.formData.product_weight);
    formData.append('no_of_pieces', this.formData.no_of_pieces);
    formData.append('product_pattern', this.formData.product_pattern);
    formData.append('product_origin', this.formData.product_origin);
    formData.append('product_material', this.formData.product_material);
    formData.append('product_warranty', this.formData.product_warranty);
    formData.append('product_care_instructions', this.formData.product_care_instructions);
    formData.append('additional_details', this.formData.additional_details);
    formData.append('gst_percentage', this.formData.gst_percentage);
    formData.append('discount_percentage', this.formData.discount_percentage);

    // Append selected images
    this.selectedImages.forEach((image) => {
      formData.append('product_image', image);
    });

    this.adminApi.saveProduct(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Product saved successfully!', 'Success', { disableTimeOut: false, progressBar: true, closeButton: true, });
        this.formData = {
          product_type_id: '',
          product_name: '',
          product_price: '',
          duplicate_price: '',
          product_size: '',
          product_color: '#000000',
          product_lable: '',
          product_details: '',
          product_image: null,
          product_brand: '',
          product_weight: '',
          no_of_pieces: '',
          product_pattern: '',
          product_origin: '',
          product_material: '',
          product_warranty: '',
          product_care_instructions: '',
          additional_details: '',
          gst_percentage: '',
          discount_percentage: '',
        }
        this.selectedImages = [];
        this.selectedImagePreviews = [];
      } else {
        this.toastr.error('Failed to save product!', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true, });
      }
    })

  }


}
