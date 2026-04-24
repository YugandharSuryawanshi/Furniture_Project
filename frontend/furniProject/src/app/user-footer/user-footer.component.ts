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
  currentYear: number = new Date().getFullYear();
  constructor(private fb: FormBuilder, private userApi: UserApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {

      const formData = this.userForm.value;

      this.userApi.addSubscriber(formData).subscribe({
        next: (res: any) => {
          if (res && res.success) {
            this.toastr.success('Thank you for subscribing!', 'Success', {
              progressBar: true,
              closeButton: true
            });
            this.userForm.reset();
          } else {
            this.toastr.error('Subscription failed! ' + res.message, 'Error');
          }
        },
        error: (err) => {
          console.error(err);

          const errorMessage = err?.error?.message || 'Server error!';

          this.toastr.error(errorMessage, 'Error');
        }
      });

    } else {
      this.toastr.error('Please fill all fields correctly!', 'Error');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
