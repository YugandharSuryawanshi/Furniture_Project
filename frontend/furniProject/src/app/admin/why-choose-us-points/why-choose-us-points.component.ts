import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-why-choose-us-points',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './why-choose-us-points.component.html',
  styleUrl: './why-choose-us-points.component.css'
})
export class WhyChooseUsPointsComponent {

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

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  // Handle file selection
  selectedImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selected_Image = file;
    }
  }

  saveData() {
    if (!this.formData.why_choose_points_name || !this.formData.why_choose_points_details) {
      this.toastr.error('Name And Details are Required..!', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
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
        this.toastr.success(data.message || 'Data Saved Successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.formData.why_choose_points_name = '';
        this.formData.why_choose_points_details = '';
        this.selected_Image = null;
        // Reset the file input field
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
      else {
        this.toastr.error(data.message || 'Failed to Save Data..!', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }

  //Start Print List Here...
  points: any = [];

  ngOnInit() {
    this.getAllPoints();
  }

  getAllPoints() {
    this.adminApi.getWhyChooseUsPoints().subscribe((data: any) => {
      this.points = data.data;
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
        this.toastr.success(res.message || 'Data Updated Successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
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
        this.toastr.error(res.message || 'Failed to Update Data..!', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
      }
    })
  }

  // DELETE POINT START HERE
  deletePoint(id: any) {
    if (confirm('Are You Sure! are you want to delete this point..')) {
      this.adminApi.deleteWhyChooseUsPoint(id).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Point Deleted Successfully..!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
          this.getAllPoints();
        }
        else {
          this.toastr.error(res.message || 'Failed to Delete Point..!', 'Error', { progressBar: true, disableTimeOut: false, closeButton: true });
        }
      })
    }
  }


}
