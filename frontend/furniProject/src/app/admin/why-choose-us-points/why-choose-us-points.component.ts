import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-why-choose-us-points',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './why-choose-us-points.component.html',
  styleUrl: './why-choose-us-points.component.css'
})
export class WhyChooseUsPointsComponent {
  errorMessage = '';
  successMessage = '';

  showList: any = false;
  addPoint: any = true;
  updatePoint: any = false;
  update_img: any = false;

  display1() {
    this.showList = false;
    this.addPoint = true;
    this.updatePoint = false;
    this.update_img = false;
    this.formData = {
      why_choose_points_name: '',
      why_choose_points_details: ''
    };
  }
  display2() {
    this.showList = true;
    this.addPoint = false;
    this.updatePoint = false;
    this.update_img = false;
  }


  // DATA SAVE ADD WHY CHOOSE US Points STARTS

  selected_Image: File | null = null;
  formData: any = {
    why_choose_points_name: '',
    why_choose_points_details: ''
  };

  constructor(public adminApi: AdminApiService) { }

  // Handle file selection
  selectedImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selected_Image = file;
    }
  }

  saveData() {
    console.log('NAME' + this.formData.why_choose_points_name);
    console.log('DETAILS' + this.formData.why_choose_points_details);

    if (!this.formData.why_choose_points_name || !this.formData.why_choose_points_details) {
      this.errorMessage = "Name and details are required.";
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }
    const formData = new FormData();
    formData.append('why_choose_points_name', this.formData.why_choose_points_name);
    formData.append('why_choose_points_details', this.formData.why_choose_points_details);
    if (this.selected_Image) {
      formData.append('why_choose_points_img', this.selected_Image);
    }

    this.adminApi.saveWhyChooseUsPoint(formData).subscribe((data: any) => {
      if (data.success) {
        this.successMessage = data.message;
        this.formData.why_choose_points_name = '';
        this.formData.why_choose_points_details = '';
        this.selected_Image = null;
        // Reset the file input field
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Reset the file input
        }
      }
      else {
        this.errorMessage = data.message;
        console.log('Error Occurred');
      }
    })
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }

  //DATA SAVE WORK END
  //Start Print List Here...
  points: any = [];

  ngOnInit() {
    this.getAllPoints();
  }

  getAllPoints() {
    this.adminApi.getWhyChooseUsPoints().subscribe((data: any) => {
      this.points = data.data; // Update this to `data.data` to access the correct property
      console.log(this.points);
      console.log("came Points" + this.points);
    });
  }


  single_image: any;
  why_choose_points_id: any;
  get_One_Point(id: any) {
    this.showList = false;
    this.addPoint = false;
    this.updatePoint = true;
    this.update_img = true;
    this.adminApi.getWhyChooseUsPointById(id).subscribe((data: any) => {
      this.formData.why_choose_points_name = data.data.why_choose_points_name;
      this.formData.why_choose_points_details = data.data.why_choose_points_details;
      this.single_image = data.data.why_choose_points_img;
      this.formData.why_choose_points_id = data.data.why_choose_points_id;
    });
  }

  // UPDATE Point Start Here
  updateData() {
    const id = this.formData.why_choose_points_id;

    const updatePointFormData = new FormData();

    updatePointFormData.append('why_choose_points_name', this.formData.why_choose_points_name)
    updatePointFormData.append('why_choose_points_details', this.formData.why_choose_points_details)
    if (this.selected_Image) {
      updatePointFormData.append('why_choose_points_img', this.selected_Image);
    }

    this.adminApi.updateWhyChooseUsPoint(id, updatePointFormData).subscribe((res: any) => {
      if (res.success) {
        this.successMessage = res.message;
        this.display2();
        this.getAllPoints();
        this.formData.why_choose_points_name = '';
        this.formData.why_choose_points_details = '';
        this.selected_Image = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Reset the file input
        }
      }
      else {
        this.errorMessage = res.message;
      }
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 5000);
    })
  }

  // DELETE POINT START HERE

  deletePoint(id: any) {
    if (confirm('Are You Sure! are you want to delete this point..')) {
      this.adminApi.deleteWhyChooseUsPoint(id).subscribe((res: any) => {
        if (res.success) {
          this.successMessage = res.message;
          this.getAllPoints();
        }
        else {
          this.errorMessage = res.message;
        }
        setTimeout(() => {
          this.successMessage = '';
          this.errorMessage = '';
        }, 5000);
      })
    }
  }


}
