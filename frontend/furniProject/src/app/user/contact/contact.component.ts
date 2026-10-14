import { Component, OnInit } from '@angular/core';

import { UserApiService } from '../../service/user-api.service';

import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { finalize } from 'rxjs';

@Component({

  selector: 'app-contact',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],

  templateUrl: './contact.component.html',

  styleUrl: './contact.component.css'

})

export class ContactComponent implements OnInit {

  contactLoading: boolean = false;

  contact = {
    first_name: '',
    last_name: '',
    contact_gmail: '',
    contact_message: ''
  };

  constructor(
    private userApi: UserApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadContactPage();
  }

  loadContactPage(): void {

    this.contactLoading = true;

    /*
     * Contact page does not have a separate API for page content.
     * We use a small delay so the skeleton is visible while
     * the page structure is prepared.
     */
    setTimeout(() => {
      this.contactLoading = false;
    }, 500);
  }

  onSubmit(): void {

    this.userApi.addContactUsInfo(this.contact)
      .pipe(
        finalize(() => {
          // API request completed
        })
      )
      .subscribe((res: any) => {

        if (res.success) {

          this.toastr.success(
            'Your message has been sent successfully!',
            'Success',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

          // Reset form
          this.contact = {
            first_name: '',
            last_name: '',
            contact_gmail: '',
            contact_message: ''
          };

        }
        else {

          this.toastr.error(
            'Error sending your message. Please try again later.',
            'Error',
            {
              disableTimeOut: false,
              progressBar: true,
              closeButton: true
            }
          );

        }

      });

  }

}