import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  contact = {
    first_name: '',
    last_name: '',
    contact_gmail: '',
    contact_message: ''
  };

  constructor(private userApi:UserApiService, private toastr: ToastrService) { }

  ngOnInit(): void { }

  onSubmit(): void {
    this.userApi.addContactUsInfo(this.contact).subscribe((res:any)=>{
      if(res.success)
      {
        this.toastr.success('Your message has been sent successfully!', 'Success', {disableTimeOut: false, progressBar: true, closeButton: true });
        // Reset the form
        this.contact = {
          first_name: '',
          last_name: '',
          contact_gmail: '',
          contact_message: ''
        };
      }
      else {
        this.toastr.error('Error sending your message. Please try again later.', 'Error', { disableTimeOut: false, progressBar: true, closeButton: true }  );
        };
    })
  }

}
