import { Component } from '@angular/core';
import { AdminApiService } from '../../service/admin-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.css'
})
export class SubscriberComponent {

  subscribers: any[] = [];
  selectedSubscriber: any | null = null;
  isEditModalOpen: boolean = false;

  constructor(private adminApi: AdminApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getSubscribers();
  }

  //Get All Subscribers
  getSubscribers(): void {
    this.adminApi.getSubscribers().subscribe((res: any) => {
      if (res.success) {
        this.subscribers = res.data;
        console.log(this.subscribers);
      } else {
        this.toastr.error('Failed to load subscribers');
      }
    }, (err) => {
      this.toastr.error('An error occurred while fetching subscribers');
    });
  }

  //Open Edit Modal
  openEditModal(subscriber: any): void {
    this.selectedSubscriber = { ...subscriber };
    this.isEditModalOpen = true;
  }

  //Close Edit Modal
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedSubscriber = null;
  }

  //Update Subscriber
  saveChanges(): void {
    if (!this.selectedSubscriber) {
      this.toastr.warning('No subscriber selected');
      return;
    }

    const updatedData = {
      id: this.selectedSubscriber.id,
      name: this.selectedSubscriber.name,
      email: this.selectedSubscriber.email,
      status: this.selectedSubscriber.status
    };

    this.adminApi.updateSubscriber(updatedData).subscribe((res: any) => {
      if (res.success) {
        const index = this.subscribers.findIndex(s => s.id === updatedData.id);
        if (index !== -1) {
          this.subscribers[index] = { ...updatedData, updated_at: res.updated_at || new Date().toISOString() };
        }

        this.toastr.success('Subscriber updated successfully', 'success', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
        this.closeEditModal();
      } else {
        this.toastr.error('Failed to update subscriber', 'error', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
      }
    }, (err) => {
      this.toastr.error('An error occurred while updating', 'error', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
    });
  }

  //Delete Subscriber
  deleteSubscriber(id: number): void {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    this.adminApi.deleteSubscriber(id).subscribe((res: any) => {
      if (res.success) {
        this.subscribers = this.subscribers.filter(s => s.id !== id);
        this.toastr.success('Subscriber deleted successfully', 'success', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
      } else {
        this.toastr.error('Failed to delete subscriber', 'error', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
      }
    }, (err) => {
      this.toastr.error('An error occurred while deleting', 'error', { closeButton: true, progressBar: true, tapToDismiss: true, disableTimeOut: false });
    });
  }


}
