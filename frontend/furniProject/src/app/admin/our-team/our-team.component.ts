import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { query } from '@angular/animations';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-our-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './our-team.component.html',
  styleUrl: './our-team.component.css'
})
export class OurTeamComponent {
  errorMessage: any = '';
  successMessage: any = '';
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

  constructor(public adminApi: AdminApiService) { }

  saveMember() {
    const formData = new FormData();

    if (!this.formData.member_name || !this.formData.member_position || !this.formData.member_details) {
      this.errorMessage = 'Please Fill the details...?';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
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
        this.successMessage = 'Member Added Successfully...!';
        this.formData.member_name = '';
        this.formData.member_position = '';
        this.formData.member_details = '';
        this.Selected_image = null;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        this.errorMessage = res.message || 'Failure to Save Team Member';
      }
      setTimeout(() => {
        this.errorMessage = '';
        this.successMessage = '';
      }, 5000);
    }, (err) => {
      this.errorMessage = 'Error occurred while saving the team member.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
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
          this.errorMessage = '';
          this.successMessage = '';
          this.members = res.data;
          console.log('Fetched Data: ', this.members);
        } else {
          this.errorMessage = res.message || 'Error fetching team members';
        }
      },
      (err) => {
        this.errorMessage = 'Failed to fetch team members. Please try again later.';
      }
    );
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  singleImage:any;
  get_single_member(id: any)
  {
    console.log('Camed to single ID : ' + id);
    this.adminApi.getSingleTeamMember(id).subscribe((data:any)=>{
      console.log('Data: ', data);
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
        this.successMessage = 'Team Member Updated Successfully...!';
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
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  deleteMember(id: any)
  {
    this.adminApi.deleteTeamMember(id).subscribe((res:any)=>{
      if(res.success)
      {
        this.successMessage = 'Team Member Deleted Successfully...!';
        this.getAllMembers();
      }
    })
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }






}

