import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  contacts:any[] = [];
  constructor(private adminApi:AdminApiService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.getContacts();
  }
  getContacts()
  {
    this.adminApi.getContactUs().subscribe((res:any)=>{
      if (res.success) {
        this.contacts = res.data;
      }
    })
  }
  deleteContact(id:any)
  {
    this.adminApi.deleteContactUs(id).subscribe((res:any)=>{
      if (res.success) {
        this.toastr.success('Contact deleted successfully', 'Success',{ progressBar: true, disableTimeOut:false, closeButton: true });
        this.getContacts();
      } else {
        this.toastr.error(res.message, 'Error',{ progressBar: true, disableTimeOut:false, closeButton: true });
      }
    })
  }

}
