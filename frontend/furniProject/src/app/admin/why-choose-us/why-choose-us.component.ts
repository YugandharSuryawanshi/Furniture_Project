import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './why-choose-us.component.html',
  styleUrl: './why-choose-us.component.css'
})
export class WhyChooseUsComponent {

  selectedImage: File | null = null;

  formData: any = {
    heading: '',
  };

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  // Handle file input change
  OnFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Update "Why Choose Us"
  updateWhyChooseUs() {
    const formData = new FormData();
    if (this.formData.heading) {
      formData.append('heading', this.formData.heading);
    }
    if (this.selectedImage) {
      formData.append('why_choose_img', this.selectedImage);
    }

    this.adminApi.updateWhyChooseUs(formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Successfully Updated', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          this.formData.heading = '';
          this.selectedImage = null;
        } else {
          this.toastr.error(res.message || 'Failed to Update', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      });
  }

  ngOnInit() {
    this.getData();
  }

  heading: any = '';
  image: any = null;
  getData() {
    this.adminApi.getWhyChooseUs().subscribe((data: any) => {
      if (data.success) {
        this.heading = data.data.heading;
        this.image = data.data.why_choose_img;
      } else {
        this.toastr.error(data .message, 'Error' , { progressBar: true, disableTimeOut:false, closeButton: true });
      }
    });
  }

}
