import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-blog-lists',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blog-lists.component.html',
  styleUrl: './blog-lists.component.css',
  providers: [DatePipe]
})
export class BlogListsComponent {

  constructor(public datePipe:DatePipe, public adminApi:AdminApiService, public router:Router) {}

  successMessage:any = '';
  errorMessage:any = '';
  showList:boolean = true;
  showUpdate:boolean = false;
  changeView()
  {
    this.showList = true;
    this.showUpdate = false;
  }


  ngOnInit()
  {
    this.get_all_blogs();
  }

  blogs:any;
  get_all_blogs()
  {
    this.adminApi.getBlogs().subscribe((data:any)=>{
      this.blogs = data.data;
    })

  }


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

  blogImg:any;
  get_One_Blog(id: any) {
    this.showList = false;
    this.showUpdate = true;
    this.adminApi.getSingleBlog(id).subscribe((data: any) => {
      const blog = data.data;
      this.blogImg = blog.blog_image;
  
      // Parse blog_post_time to a valid date format
      const time = blog.blog_post_time; // E.g., "3:23 PM"
      if (time) {
        // Convert "3:23 PM" to "1970-01-01T15:23:00" for DatePipe
        const [hours, minutesPart] = time.split(':');
        const minutes = minutesPart.slice(0, 2);
        const period = minutesPart.slice(3);
        const hours24 =
          period.toLowerCase() === 'pm'
            ? parseInt(hours, 10) % 12 + 12
            : parseInt(hours, 10) % 12;
        blog.blog_post_time = `${hours24.toString().padStart(2, '0')}:${minutes}`;
      }
  
      this.formData = { ...blog };
      
    });
  }
  

  updateBlog() {
    const formData = new FormData();
    const id = this.formData.blog_id;
    const timeWithDate = `1970-01-01T${this.formData.blog_post_time}`;
    const formattedTime = this.datePipe.transform(timeWithDate, 'h:mm a'); // Format time as h:mm AM/PM
    this.formData.blog_post_time = formattedTime || this.formData.blog_post_time;

  
    formData.append('blog_title', this.formData.blog_title);
    formData.append('blog_post_date', this.formData.blog_post_date);
    formData.append('blog_post_time', this.formData.blog_post_time);
    formData.append('blog_post_by', this.formData.blog_post_by);
    formData.append('blog_post_by_position', this.formData.blog_post_by_position);
  
    if (this.selectedImage) {
      formData.append('blog_image', this.selectedImage, this.selectedImage.name);
    }
    this.adminApi.updateBlog(id, formData).subscribe(
      (data: any) => {
        if (data.success) {
          this.successMessage = data.message;
          this.formData.blog_title = '';
          this.formData.blog_post_date = '';
          this.formData.blog_post_time = '';
          this.formData.blog_post_by = '';
          this.formData.blog_post_by_position = '';
          this.selectedImage = null;
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.showList = true;
          this.showUpdate = false;

          this.get_all_blogs();
        } else {
          this.errorMessage = data.message;
          this.successMessage = '';
        }
      });
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
  

  deleteBlog(id:any)
  {
    this.adminApi.deleteBlog(id).subscribe((res:any)=>{
      if(res.success){
        this.successMessage = res.message;
        this.get_all_blogs();
      }else{
        this.errorMessage = res.message;
      }
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 5000);
    })
  }

}
