import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-type',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-type.component.html',
  styleUrl: './product-type.component.css'
})
export class ProductTypeComponent {

  constructor(private adminApi: AdminApiService, private router: Router, private toastr: ToastrService) { }

  displayList: boolean = false;
  displayAddType: boolean = true;
  displayUpdate: boolean = false;

  //Top Menu On Change display parts
  showList() {
    this.displayList = true;
    this.displayAddType = false;
    this.displayUpdate = false;
  }
  addType() {
    this.displayAddType = true;
    this.displayList = false;
  }

  // Add Product Type
  add_Product_Type(product_type_form: any) {
    const data = { product_type_name: product_type_form.value.product_type_name };
    if (data.product_type_name) {
      this.adminApi.saveProductType(data).subscribe(
        (res: any) => {
          this.toastr.success(res.message || 'Product Type Saved Successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          product_type_form.reset();
          this.getProducts();
        });
    } else {
      this.toastr.warning('Product Type Name Is Required', 'Enter', { progressBar: true, disableTimeOut: false, closeButton: true });
    }
  }

  ngOnInit() {
    this.getProducts();
  }

  //get all product types
  types: any[] = [];
  getProducts() {
    this.adminApi.getProductTypes().subscribe(
      (response: any) => {
        if (response.success) {
          this.types = response.product_types;
        } else {
          this.toastr.error(response.message || 'Failed to fetch Product Types', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
          console.log('Failed to fetch product types:', response.message);
        }
      });
  }

  //Display which part when cancel button is clicked
  changeDisplay() {
    this.displayUpdate = false;
    this.displayList = true;
  }

  //get single product type
  singleProduct_type = '';
  singleProduct_id: any;
  getSingleProduct_type(id: any) {
    this.displayUpdate = true;
    this.displayList = false;
    this.adminApi.getOneProductType(id).subscribe((res: any) => {
      this.singleProduct_type = res.product_type.product_type_name;
      this.singleProduct_id = res.product_type.product_type_id;
    })
  }

  //Update product type
  updateType(form: any) {
    const data = {
      product_type_id: this.singleProduct_id,
      product_type_name: form.value.product_type_name
    };

    if (data.product_type_id) {
      this.adminApi.updateProductType(data.product_type_id, data.product_type_name).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Product Type updated successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          this.displayUpdate = false;
          this.displayList = true;
          form.reset();
          this.getProducts();
        }
        else {
          this.toastr.error(res.message || 'Failed to update product type', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      })
    }
  }

  //Delete product type
  deleteProductType(id: any) {
    this.adminApi.deleteProductType(id).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.message || 'Product Type deleted successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getProducts();
      }
      else {
        this.toastr.error(data.message || 'Failed to delete product type', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }


}
