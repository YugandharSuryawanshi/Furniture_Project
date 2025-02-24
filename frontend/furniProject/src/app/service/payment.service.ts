import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = "http://localhost:1000";

  constructor(private http: HttpClient, private userApi: UserApiService) { }

  //Get razorpay key id
  getId()
  {
    return this.http.get(`${this.apiUrl}/send_key_id`);
  }

  // Create Razorpay Order
  createOrder(amount: number, currency: string): Observable<any> {
    const token = this.userApi.getToken();
    if (!token) {
      return throwError(() => ({ status: 401, message: 'Unauthorized' }));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create_order`, { amount, currency }, { headers })
      .pipe(
        catchError(error => {
          console.error('Error in createOrder:', error);
          return throwError(() => error);
        })
      );
  }

  // Verify Payment
  verifyPayment(paymentData: any): Observable<any> {
    const token = this.userApi.getToken();
    if (!token) {
      console.error(" Unauthorized: No token found!");
      return throwError(() => ({ status: 401, message: 'Unauthorized' }));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/verify_payment`, paymentData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error in verifyPayment:', error);
          return throwError(() => error);
        })
      );
}

  // Place COD Order
  placeCODOrder(orderData: any): Observable<any> {
    const token = this.userApi.getToken();
    if (!token) {
      return throwError(() => ({ status: 401, message: 'Unauthorized' }));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/place_cod_order`, orderData, { headers }).pipe(catchError(error => {
          console.error('Error in placeCODOrder:', error);
          return throwError(() => error);
        })
      );
  }



}
