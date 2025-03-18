import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  constructor(public adminApi: AdminApiService, private toastr:ToastrService) { }

  display: boolean = true;
  displayUpdateForm: boolean = false;

  products: any[] = [];
  searchStr: string = '';
  selectedImages: File[] = [];
  selectedImagePreviews: string[] = [];
  productColor: string = '#000000';
  productTypes: any = [];
  productImages: string[] = [];
  basePath: string = 'http://localhost:1000/uploads/';
  canShowImages: boolean = true;

  ngOnInit(): void {
    this.getProducts();
    this.getProductTypes();
  }

  getProducts() {
    this.adminApi.getProducts().subscribe((res: any) => {
      this.products = res.products;
    });
  }

  searchProducts() {
    if (this.searchStr.trim() === '') {
      this.getProducts();
    } else {
      this.adminApi.searchProducts(this.searchStr).subscribe((response: any) => {
        if (response.success) {
          this.products = response.products;
        } else {
          this.products = [];
        }
      });
    }
  }

  getProductTypes() {
    this.adminApi.getProductTypes().subscribe((res: any) => {
      if (res.success) {
        this.productTypes = res.product_types;
      }
    });
  }

  get_This_Product(product_id: any) {
    this.display = false;
    this.displayUpdateForm = true;
    this.adminApi.getProduct(product_id).subscribe((res: any) => {
      if (res.success) {
        this.formData = { ...res.single_product };
        const imagesString = res.images[0];
        this.productImages = imagesString.split(',').map((image: string) => this.basePath + image.trim());
      } else {
        console.error('Product not found');
        this.toastr.error('Product not found', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true, });
      }
    });
  }

  onImageSelect(event: Event): void {
    this.canShowImages = false;
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const files = Array.from(fileInput.files);
      this.selectedImages = files;

      this.selectedImagePreviews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  formData = {
    product_id: '',
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
  };

  updateProduct() {
    const formData = new FormData();
    formData.append('product_id', this.formData.product_id);
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

    if (this.selectedImages) {
      this.selectedImages.forEach((image: File) => {
        formData.append('product_image', image);
      });
    }

    this.adminApi.updateProduct(this.formData.product_id, formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Product updated successfully!', 'Success', { disableTimeOut: false, progressBar: true, closeButton: true, });
        this.display = true;
        this.displayUpdateForm = false;
        this.getProducts();
        this.selectedImages = [];
      } else {
        this.toastr.error('Getting Error', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true, });
      }
    });
  }

  deleteProduct(product_id: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log(product_id);
      
      this.adminApi.deleteProduct(product_id).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Product deleted successfully!', 'Success', { disableTimeOut: false, progressBar: true, closeButton: true, });
          this.getProducts();
        } else {
          this.toastr.error('Failed to delete product', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true, });
        }
      });
    }
  }






}
