import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { query } from '@angular/animations';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-our-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './our-team.component.html',
  styleUrl: './our-team.component.css'
})
export class OurTeamComponent {

  constructor(private adminApi: AdminApiService, private toastr:ToastrService) { }
  
  showList: boolean = false;
  addMember: boolean = true;
  updateMember: boolean = false;

  add()
  {
    this.showList = false;
    this.addMember = true;
    this.updateMember = false;
    this.formData = {
      member_name: '',
      member_position: '',
      member_details: '',
      member_image: null
    }
  }
  list()
  {
    this.showList = true;
    this.addMember = false;
    this.updateMember = false;
    this.getAllMembers();
  }
  changeView()
  {
    this.showList = true;
    this.addMember = false;
    this.updateMember = false;
  }

  Selected_image: File | null = null;
  selectImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.Selected_image = file;
    }
  }

  formData: any =
    {
      member_name: '',
      member_position: '',
      member_details: '',
      member_image: null
    }

  saveMember() {
    const formData = new FormData();

    if (!this.formData.member_name || !this.formData.member_position || !this.formData.member_details) {
      this.toastr.error('Please Fill the Detils..?', 'Error', {progressBar: true, disableTimeOut: false, closeButton: true});
      return;
    }

    formData.append('member_name', this.formData.member_name);
    formData.append('member_position', this.formData.member_position);
    formData.append('member_details', this.formData.member_details);

    if (this.Selected_image) {
      formData.append('member_image', this.Selected_image);
    }

    this.adminApi.saveTeamMember(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Member Added Successfully...!', 'Success', {progressBar: true, disableTimeOut: false, closeButton: true});
        this.formData.member_name = '';
        this.formData.member_position = '';
        this.formData.member_details = '';
        this.Selected_image = null;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        this.toastr.error(res.message || 'Failed to Add Member...!', 'Error', {progressBar: true, disableTimeOut: false, closeButton: true});
      }
    }, (err) => {
      this.toastr.error('Error Occured while saving the team member', 'Error', {progressBar: true, disableTimeOut: false, closeButton: true});
    });
  }

  ngOnInit() {
    this.getAllMembers();
  }
members:any;
  getAllMembers() {
    this.adminApi.getTeamMembers().subscribe(
      (res: any) => {
        if (res.success) {
          this.members = res.data;
        } else {
          this.toastr.error(res.message || 'Error getching team members', 'Error', {progressBar : true, disableTimeOut: false, closeButton: true});
        }
      },
      (err) => {
        this.toastr.error('Error Occured while fetching team members', 'Error', {progressBar: true, disableTimeOut: false, closeButton: true});
      }
    );
  }

  singleImage:any;
  get_single_member(id: any)
  {
    this.adminApi.getSingleTeamMember(id).subscribe((data:any)=>{
      const team_member = data.data;
      this.singleImage = team_member.member_image;
      this.formData = {...team_member}
      this.updateMember = true;
      this.addMember = false;
      this.showList = false;
    })
  }

  update_Member()
  {
    const updateFormData = new FormData();
    const id = this.formData.member_id;
    
    updateFormData.append('member_name', this.formData.member_name);
    updateFormData.append('member_position', this.formData.member_position);
    updateFormData.append('member_details', this.formData.member_details);
    if (this.Selected_image) {
      updateFormData.append('member_image', this.Selected_image);
    }
    this.adminApi.updateTeamMember(id, updateFormData).subscribe((res:any)=>{
      if(res.success)
      {
        this.toastr.success(res.message || 'Team Member Updated Successfully', 'Success' , { progressBar: true, disableTimeOut:false, closeButton: true });
        this.getAllMembers();
        this.formData.member_name = '';
        this.formData.member_position = '';
        this.formData.member_details = '';
        this.Selected_image = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    })
  }

  deleteMember(id: any)
  {
    this.adminApi.deleteTeamMember(id).subscribe((res:any)=>{
      if(res.success)
      {
        this.toastr.success('Team Member Deleted Successfully...!', 'Success', { progressBar: true, disableTimeOut: false, closeButton: true });
        this.getAllMembers();
      }
    })
  }

}

