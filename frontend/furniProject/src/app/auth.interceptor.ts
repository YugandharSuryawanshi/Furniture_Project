import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserApiService } from './service/user-api.service';
import { AdminApiService } from './service/admin-api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userApi = inject(UserApiService);
  const adminApi = inject(AdminApiService);

  const url = req.url;

  // --------------------------------------------------
  // 1. PUBLIC USER APIs
  // --------------------------------------------------
  const publicUserApis = [
    '/register',
    '/login',
    '/reset-password',
    '/send-otp',
    '/verify-otp',
    '/register-send-otp',
    '/register-verify-otp',
    '/home',
    '/products',
    '/product?',
    '/get_reviews/',
    '/contact_us',
    '/subscribe',
    '/most_viewed'
  ];

  // --------------------------------------------------
  // 2. PUBLIC ADMIN APIs
  // --------------------------------------------------
  const publicAdminApis = [
    '/adminRegister',
    '/adminLogin',
    '/verifyAdminPass',
    '/reset-password',
    '/send-otp',
    '/verify-otp',
    '/admin-register-send-otp',
    '/admin-register-verify-otp'
  ];

  // --------------------------------------------------
  // 3. Check whether current request is public
  // --------------------------------------------------
  const isPublicUserApi = publicUserApis.some(api =>
    url.includes(api)
  );

  const isPublicAdminApi = publicAdminApis.some(api =>
    url.includes(api)
  );

  // --------------------------------------------------
  // 4. ADMIN REQUEST
  // --------------------------------------------------
  if (url.includes('/admin/')) {

    // Login / Register / OTP etc. do not need token
    if (isPublicAdminApi) {
      return next(req);
    }

    const adminToken = adminApi.getToken();

    if (adminToken) {

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      return next(authReq);
    }

    return next(req);
  }

  // --------------------------------------------------
  // 5. USER REQUEST
  // --------------------------------------------------
  if (isPublicUserApi) {
    return next(req);
  }

  const userToken = userApi.getToken();

  if (userToken) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return next(authReq);
  }

  // --------------------------------------------------
  // 6. No token available
  // --------------------------------------------------
  return next(req);
};
