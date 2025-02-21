import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserApiService } from '../../service/user-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-print-receipt',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './print-receipt.component.html',
  styleUrl: './print-receipt.component.css'
})
export class PrintReceiptComponent {

  constructor(
    public userApi:UserApiService,
    public toastr:ToastrService,
    private route: ActivatedRoute,
    private renderer:Renderer2
  ) { }

  orderId: number = 0;
  orderDetails: any = null;
  userDetails: any;

  ngOnInit(): void {
    const paramOrderId = this.route.snapshot.paramMap.get('order_id');
    this.orderId = paramOrderId ? Number(paramOrderId) : 0;

    if (this.orderId > 0) {
      this.getOrderReceipt();
    } else {
      console.error("Invalid Order ID");
      this.toastr.error('Invalid Order ID', 'Error', {disableTimeOut: false , progressBar:true  , closeButton: true});
    }
  }

  getOrderReceipt() {
    this.userApi.getOrderReceipt(this.orderId).subscribe(
      (res: any) => {
        if (res.success) {
          this.orderDetails = res.order
          console.log(this.orderDetails);
          
        }
      },
      (error) => {
        console.error('Error fetching receipt:', error);
        this.toastr.error('Error fetching receipt', 'Error', { disableTimeOut: false , progressBar:true , closeButton: true });
      }
    );
  }


  printReceipt() {
    this.hideHeaderFooter();

    setTimeout(() => {
      window.print();
    }, 300); // Delay to ensure the UI updates before printing

    setTimeout(() => {
      this.showHeaderFooter();
    }, 1000); //Reappear header & footer after printing
  }

  hideHeaderFooter() {
    const header = document.querySelector('app-user-navbar');
    const footer = document.querySelector('app-user-footer');

    if (header) this.renderer.setStyle(header, 'display', 'none');
    if (footer) this.renderer.setStyle(footer, 'display', 'none');
  }

  showHeaderFooter() {
    const header = document.querySelector('app-user-navbar');
    const footer = document.querySelector('app-user-footer');

    if (header) this.renderer.setStyle(header, 'display', 'block');
    if (footer) this.renderer.setStyle(footer, 'display', 'block');
  }

}
