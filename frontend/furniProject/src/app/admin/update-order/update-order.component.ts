import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminApiService } from '../../service/admin-api.service';

@Component({
  selector: 'app-update-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent implements OnInit {

  constructor(private route:ActivatedRoute ,private adminApi: AdminApiService,private toastr: ToastrService, private router:Router) { }

  // orderDetails:any;
  orderDetails: any = {
    order_status: '',
    payment_status: ''
  };

  ngOnInit() {
    const order_id = this.route.snapshot.paramMap.get('id');
    console.log(order_id);
    this.getOrderDetails(order_id);
  }

  getOrderDetails(order_id: any) {
    this.adminApi.getSingleOrder(order_id).subscribe((res: any) => {
      console.log(res);
      this.orderDetails = res.data;
      this.toastr.success('Order details fetched successfully');
    });
  }

  updateOrder() {
    console.log(this.orderDetails);
    console.log(this.orderDetails.order_status);
    console.log(this.orderDetails.payment_status);
    console.log(this.orderDetails.order_id);
    this.adminApi.updateOrder(this.orderDetails).subscribe((res: any) => {
      if (res.success)
      {
        this.toastr.success('Order updated successfully');
        this.router.navigate(['/admin/orders']);
      }
      else
      {
        this.toastr.error('Failed to update order');
      }
    })
    
    
    // this.adminApi.updateOrderStatus(this.orderDetails).subscribe((res: any) => {
    //   this.toastr.success('Order status updated successfully');
    // }, (err: any) => {
    //   this.toastr.error('Failed to update order status');
    // });
  }

}