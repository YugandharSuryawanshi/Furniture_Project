import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css'
})
export class TestimonialComponent {

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  displayAdd: boolean = true;
  displayList: boolean = false;
  displayUpdate: boolean = false;

  display1() {
    this.displayAdd = true;
    this.displayList = false;
    this.displayUpdate = false;
    this.HideImage = false;
    this.formData.customer_name = '';  //for clear input fields
    this.formData.customer_position = '';
    this.formData.customer_massage = '';

  }
  display2() {
    this.getAllTestimonials();
    this.displayAdd = false;
    this.displayList = true;
    this.displayUpdate = false;
  }
  display3() {
    this.displayUpdate = false;
    this.displayList = true;
    this.HideImage = false;
  }

  formData: any = {
    customer_name: '',
    customer_position: '',
    customer_massage: '',
    customer_image: null,
  }

  selectedImage: File | null = null;
  onSelectedImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }
  saveTestimonial() {
    const formData = new FormData();

    formData.append('customer_name', this.formData.customer_name);
    formData.append('customer_position', this.formData.customer_position);
    formData.append('customer_massage', this.formData.customer_massage);

    if (this.selectedImage) {
      formData.append('customer_image', this.selectedImage, this.selectedImage.name);
    }

    //Send Form Data TO Backend
    this.adminApi.saveTestimonial(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(res.message || 'Testimonial Saved Successfully', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.formData = {
          customer_name: '',
          customer_position: '',
          customer_massage: '',
          customer_image: null,
        }
        this.selectedImage = null;
        this.getAllTestimonials();
      }
      else {
        this.toastr.success('Error To Save Testimonial Data', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }

  ngOnInit() {
    this.getAllTestimonials();
  }
  // Get the testimonial
  testimonials: any = [];
  getAllTestimonials() {
    this.adminApi.getTestimonials().subscribe((res: any) => {
      if (res.success) {
        this.testimonials = res.data;
      }
      else {
        this.toastr.success('Error To Get Testimonial' + res.message, 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }

  // Fetch Testimonial and Set to Form
  get_This_Product(id: any) {
    this.displayAdd = false;
    this.displayList = false;
    this.displayUpdate = true;
    this.HideImage = true;

    this.adminApi.getOneTestimonial(id).subscribe(
      (res: any) => {
        if (res.success) {
          this.formData = { ...res.data }; //Spread Operator is Used Here For Display Info in Testimonial
        } else {
          this.toastr.error('Error fetching Testimonial: ' + res.message, 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      });
  }

  // Handle Image Selection for Update
  HideImage: boolean = true;
  onSelectedUpdateImage(event: any) {
    this.HideImage = false;
    this.selectedImage = event.target.files[0];
  }

  // Save Testimonial
  updateTestimonial() {
    const updatedFormData = new FormData();
    updatedFormData.append('customer_name', this.formData.customer_name);
    updatedFormData.append('customer_position', this.formData.customer_position);
    updatedFormData.append('customer_massage', this.formData.customer_massage);
    if (this.selectedImage) {
      updatedFormData.append('customer_image', this.selectedImage, this.selectedImage.name);
    }

    this.adminApi.updateTestimonial(this.formData.customer_id, updatedFormData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(res.message || 'Testimonial Updated Successfully', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getAllTestimonials();
        this.displayAdd = false;
        this.displayList = true;
        this.displayUpdate = false;
        this.formData = {
          customer_name: '',
          customer_position: '',
          customer_massage: '',
          customer_image: null,
        }
        this.selectedImage = null;
      }
      else {
        this.toastr.error('Error To Update Testimonial Data', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }

  // Delete Testimonial
  deleteProduct(id: any) {
    if (confirm('Are you sure!! you want to delete this')) {
      this.adminApi.deleteTestimonial(id).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Testimonial Deleted Successfully', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          this.getAllTestimonials();
        }
        else {
          this.toastr.error('Error To Delete Testimonial Data', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      })
    }
  }

}
