import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  Observable,
  throwError
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // Development
  private apiUrl = 'http://localhost:4000';

  // Production
  // private apiUrl =
  //   'https://furniture-backend-ssa5.onrender.com';

  constructor(
    private http: HttpClient
  ) { }


  // ==================================================
  // RAZORPAY KEY ID
  // ==================================================

  getId(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/send_key_id`
    ).pipe(

      catchError(error => {

        console.error(
          'Error getting Razorpay key:',
          error
        );

        return throwError(() => error);

      })

    );
  }


  // ==================================================
  // CREATE RAZORPAY ORDER
  // ==================================================

  createOrder(
    amount: number,
    currency: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/create_order`,
      {
        amount,
        currency
      }
    ).pipe(

      catchError(error => {

        console.error(
          'Error in createOrder:',
          error
        );

        return throwError(() => error);

      })

    );
  }


  // ==================================================
  // VERIFY PAYMENT
  // ==================================================

  verifyPayment(
    paymentData: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/verify_payment`,
      paymentData
    ).pipe(

      catchError(error => {

        console.error(
          'Error in verifyPayment:',
          error
        );

        return throwError(() => error);

      })

    );
  }


  // ==================================================
  // COD ORDER
  // ==================================================

  placeCODOrder(
    orderData: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/place_cod_order`,
      orderData
    ).pipe(

      catchError(error => {

        console.error(
          'Error in placeCODOrder:',
          error
        );

        return throwError(() => error);

      })

    );
  }

}