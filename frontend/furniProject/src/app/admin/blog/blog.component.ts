import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  providers: [DatePipe]
})
export class BlogComponent {

  errorMessage: string = '';
  successMessage: string = '';

  constructor(public datePipe:DatePipe, public adminApi:AdminApiService, public router:Router) {}

  formData: any = {
    blog_title: '',
    blog_post_date: '',
    blog_post_time: '',
    blog_post_by: '',
    blog_post_by_position: '',
    blog_image: null,
  };

  selectedImage: File | null = null;

  getImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  saveBlog() {
    const formData = new FormData();

    // Convert the time to 12-hour format using DatePipe
    const timeWithDate = `1970-01-01T${this.formData.blog_post_time}`;
    const formattedTime = this.datePipe.transform(timeWithDate, 'h:mm a'); // Format time as h:mm AM/PM
    this.formData.blog_post_time = formattedTime || this.formData.blog_post_time;

    formData.append('blog_title', this.formData.blog_title);
    formData.append('blog_post_date', this.formData.blog_post_date);
    formData.append('blog_post_time', this.formData.blog_post_time);
    formData.append('blog_post_by', this.formData.blog_post_by);
    formData.append('blog_post_by_position', this.formData.blog_post_by_position);

    if (this.selectedImage) {
      formData.append('blog_image', this.selectedImage);
    }

    console.log('Blog Title: ' + this.formData.blog_title);
    console.log('Blog Post Date: ' + this.formData.blog_post_date);
    console.log('Blog Post Time: ' + this.formData.blog_post_time);
    console.log('Blog Post By: ' + this.formData.blog_post_by);
    console.log('Blog Post By Position: ' + this.formData.blog_post_by_position);
    console.log('Blog Image: ', this.selectedImage);

    this.adminApi.saveBlog(formData).subscribe((res:any)=>{
      if(res.success)
      {
        this.successMessage = 'Blog saved successfully'+ res.message;
        this.formData.blog_title='';
        this.formData.blog_post_date='';
        this.formData.blog_post_time='';
        this.formData.blog_post_by='';
        this.formData.blog_post_by_position='';
        this.selectedImage = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Reset the file input
        }
      }
      else
      {
        this.errorMessage = 'Error saving blog'+ res.message;
      }
    })
    setTimeout(()=>{
      this.errorMessage = '';
      this.successMessage= '';
    },5000);
    
  }


}