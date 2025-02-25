import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {

  constructor(public adminApi:AdminApiService, private toastr:ToastrService){}
  
  selectedImagePreview: string | ArrayBuffer | null = null;
  selectedImage: any;

  formData = {
    banner_title: '',
    banner_details: '',
    banner_link: '',
    banner_image: null,
  };

  bannerImageUrl: string = '';

  ngOnInit(): void {
    this.getBanner();
  }

  getBanner(): void {
    this.adminApi.getBanner().subscribe((data: any) => {
      if (data.success) {
        this.bannerImageUrl = `http://localhost:1000/uploads/${data.banner.banner_image}`;
        this.formData.banner_title = data.banner.banner_title;
        this.formData.banner_details = data.banner.banner_details;
        this.formData.banner_link = data.banner.banner_link;
      } else {
        this.toastr.error('No banner data found', 'Error', { progressBar: true, closeButton: true , disableTimeOut: false });
      }
    });
  }


  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  updateBanner(): void {
    const formData = new FormData();
    formData.append('banner_title', this.formData.banner_title);
    formData.append('banner_details', this.formData.banner_details);
    formData.append('banner_link', this.formData.banner_link);

    if (this.selectedImage) {
      formData.append('banner_image', this.selectedImage);
    }

    this.adminApi.updateBanner(formData).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success('Banner updated successfully', 'Success', { progressBar: true, closeButton: true , disableTimeOut: false });
          this.getBanner();
        } else {
          console.error('Failed to update banner:', res.message || res.error || 'Unknown error');
          this.toastr.error(res.message, 'Error', { progressBar: true, closeButton: true , disableTimeOut: false });
        }
      }
    )

}

}
