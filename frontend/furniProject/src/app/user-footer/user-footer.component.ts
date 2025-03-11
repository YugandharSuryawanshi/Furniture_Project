import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserApiService } from '../service/user-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-footer.component.html',
  styleUrl: './user-footer.component.css'
})
export class UserFooterComponent {

  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private userApi: UserApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.userApi.addSubscriber(this.userForm.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Thank you for subscribing!', 'Success', { progressBar: true, closeButton: true, disableTimeOut: false });
          this.userForm.reset();
        }
        else {
          this.toastr.error('Error subscribing', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
        }
      })
    } else {
      this.toastr.error('Please fill out the form correctly!', 'Error', { progressBar: true, closeButton: true, disableTimeOut: false });
    }
  }

}
