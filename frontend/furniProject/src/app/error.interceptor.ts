import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

import { UserApiService } from './service/user-api.service';
import { AdminApiService } from './service/admin-api.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const userApi = inject(UserApiService);
  const adminApi = inject(AdminApiService);

  const publicAuthApis = [
    '/register',
    '/login',
    '/reset-password',
    '/send-otp',
    '/verify-otp',
    '/register-send-otp',
    '/register-verify-otp',
    '/adminRegister',
    '/adminLogin',
    '/verifyAdminPass',
    '/admin-register-send-otp',
    '/admin-register-verify-otp'
  ];

  const isPublicAuthApi = publicAuthApis.some(api =>
    req.url.includes(api)
  );

  const isAdminRequest = req.url.includes('/admin/');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: error.message,
        error: error.error
      });

      // =========================================================
      // 401 - Unauthorized
      // =========================================================

      if (error.status === 401) {

        if (isPublicAuthApi) {
          return throwError(() => error);
        }

        if (isAdminRequest) {

          const adminToken = adminApi.getToken();

          if (adminToken) {

            adminApi.clearToken();

            toastr.warning(
              'Your admin session has expired. Please login again.',
              'Session Expired'
            );

            router.navigate(['/admin/login']);
          }

          return throwError(() => error);
        }

        const userToken = userApi.getToken();

        if (userToken) {

          userApi.clearToken();

          toastr.warning(
            'Your session has expired. Please login again.',
            'Session Expired'
          );

          router.navigate(['/user/login']);
        }

        return throwError(() => error);
      }


      // =========================================================
      // 403 - Forbidden
      // =========================================================

      if (error.status === 403) {

        const backendError =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message || '';

        const isTokenExpired =
          backendError.toLowerCase().includes('token is invalid') ||
          backendError.toLowerCase().includes('token is expired') ||
          backendError.toLowerCase().includes('invalid or expired') ||
          backendError.toLowerCase().includes('expired token');


        // ---------------------------------------------------------
        // 403 because token is invalid / expired
        // ---------------------------------------------------------

        if (isTokenExpired) {

          if (isAdminRequest) {

            const adminToken = adminApi.getToken();

            if (adminToken) {

              adminApi.clearToken();

              toastr.warning(
                'Your admin session has expired. Please login again.',
                'Session Expired'
              );

              router.navigate(['/admin/login']);
            }

          } else {

            const userToken = userApi.getToken();

            if (userToken) {

              userApi.clearToken();

              toastr.warning(
                'Your session has expired. Please login again.',
                'Session Expired'
              );

              router.navigate(['/user/login']);
            }

          }

          return throwError(() => error);
        }


        // ---------------------------------------------------------
        // 403 because user/admin really has no permission
        // ---------------------------------------------------------

        toastr.error(
          'You do not have permission to perform this action.',
          'Access Denied'
        );

        return throwError(() => error);
      }


      // =========================================================
      // 404 - Not Found
      // =========================================================

      if (error.status === 404) {

        toastr.error(
          'The requested resource was not found.',
          'Not Found'
        );

        return throwError(() => error);
      }


      // =========================================================
      // 502 / 503 / 504 - Server Unavailable
      // =========================================================

      if (
        error.status === 502 ||
        error.status === 503 ||
        error.status === 504
      ) {

        toastr.error(
          'Server is temporarily unavailable. Please try again later.',
          'Server Unavailable'
        );

        return throwError(() => error);
      }


      // =========================================================
      // 500 - Internal Server Error
      // =========================================================

      if (error.status === 500) {

        toastr.error(
          'Something went wrong on the server. Please try again later.',
          'Server Error'
        );

        return throwError(() => error);
      }


      // =========================================================
      // 0 - Connection Error
      // =========================================================

      if (error.status === 0) {

        toastr.error(
          'Unable to connect to the server. Please check your internet connection or try again later.',
          'Connection Error'
        );

        return throwError(() => error);
      }


      // =========================================================
      // Other Errors
      // =========================================================

      return throwError(() => error);
    })
  );
};