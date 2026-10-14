import { Component } from '@angular/core';
import { AdminApiService } from '../../service/admin-api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../service/user-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  protectedData: any;

  users: any[] = [];
  products: any[] = [];
  dashboardOrders: any[] = [];

  user_count: number = 0;
  product_count: number = 0;
  product_type_count: number = 0;
  testimonial_count: number = 0;
  blog_count: number = 0;
  order_count: number = 0;
  subscriber_count: number = 0;
  team_count: number = 0;
  reviews_count: number = 0;
  wishlist_count: number = 0;

  adminName: string = '';

  userList: boolean = false;
  poster: boolean = true;
  updates: boolean = false;

  user_detail: any;

  wrongPass: string = '';

  dashboardLoading: boolean = false;

  private isInitialDashboardLoad: boolean = true;
  private dashboardRequestsCompleted: number = 0;
  private readonly totalDashboardRequests: number = 10;

  updatingUser: boolean = false;
  deletingUserId: number | null = null;

  formData: any = {
    user_id: '',
    user_name: '',
    user_email: '',
    user_mobile: '',
    user_password: '',
    confirm_password: ''
  };

  constructor(
    private adminApi: AdminApiService,
    private userApi: UserApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    if (!this.adminApi.protectRoute()) {
      return;
    }

    this.dashboardLoading = true;

    this.loadDashboardData(true);

    this.adminApi.getProtectedData().subscribe({
      next: (data) => {
        this.protectedData = data;
      },
      error: (error) => {
        console.error('Error fetching protected data:', error);
      }
    });

    this.getloginAdmin();
  }

  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  loadDashboardData(showSkeleton: boolean = false): void {

    if (showSkeleton) {
      this.dashboardLoading = true;
      this.isInitialDashboardLoad = true;
      this.dashboardRequestsCompleted = 0;
    }

    this.user();
    this.productsData();
    this.productTypeCount();
    this.testimonialCount();
    this.blogCount();
    this.orders();
    this.subscribers();
    this.teamMembers();
    this.reviews();
    this.wishlists();
  }

  private dashboardRequestCompleted(): void {

    if (!this.isInitialDashboardLoad) {
      return;
    }

    this.dashboardRequestsCompleted++;

    if (
      this.dashboardRequestsCompleted >=
      this.totalDashboardRequests
    ) {

      setTimeout(() => {
        this.dashboardLoading = false;
        this.isInitialDashboardLoad = false;
      }, 700);
    }
  }

  // =========================================================
  // USER COUNT
  // =========================================================

  user(): void {

    this.adminApi.get_users()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (response: any) => {

          if (response && response.data) {
            this.users = response.data;
            this.user_count = this.users.length;
          } else {
            this.users = [];
            this.user_count = 0;
          }

        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
  }

  // =========================================================
  // PRODUCT COUNT
  // =========================================================

  productsData(): void {

    this.adminApi.getProducts()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.products = data?.products || [];
          this.product_count = this.products.length;

        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }

  // =========================================================
  // PRODUCT TYPE COUNT
  // =========================================================

  productTypeCount(): void {

    this.adminApi.getProductTypes()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.product_type_count =
            data?.product_types?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching product types:', error);
        }
      });
  }

  // =========================================================
  // TESTIMONIAL COUNT
  // =========================================================

  testimonialCount(): void {

    this.adminApi.getTestimonials()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.testimonial_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching testimonials:', error);
        }
      });
  }

  // =========================================================
  // BLOG COUNT
  // =========================================================

  blogCount(): void {

    this.adminApi.getBlogs()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.blog_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching blogs:', error);
        }
      });
  }

  // =========================================================
  // ORDER COUNT
  // =========================================================

  orders(): void {

    this.adminApi.getOrders()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.dashboardOrders = data?.data || [];
          this.order_count = this.dashboardOrders.length;

        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
  }

  // =========================================================
  // SUBSCRIBER COUNT
  // =========================================================

  subscribers(): void {

    this.adminApi.getSubscribers()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.subscriber_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching subscribers:', error);
        }
      });
  }

  // =========================================================
  // TEAM MEMBER COUNT
  // =========================================================

  teamMembers(): void {

    this.adminApi.getTeamMembers()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.team_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching team members:', error);
        }
      });
  }

  // =========================================================
  // REVIEW COUNT
  // =========================================================

  reviews(): void {

    this.adminApi.getReviews()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.reviews_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
        }
      });
  }

  // =========================================================
  // WISHLIST COUNT
  // =========================================================

  wishlists(): void {

    this.adminApi.getAllWishlist()
      .pipe(
        finalize(() => {
          this.dashboardRequestCompleted();
        })
      )
      .subscribe({
        next: (data: any) => {

          this.wishlist_count =
            data?.data?.length || 0;

        },
        error: (error) => {
          console.error('Error fetching wishlist:', error);
        }
      });
  }

  // =========================================================
  // ADMIN DETAILS
  // =========================================================

  getloginAdmin(): void {

    this.adminApi.getAdminDetails()?.subscribe({
      next: (data: any) => {

        if (data?.success && data?.admin) {

          const adminName =
            data.admin.admin_name || '';

          const firstName =
            adminName.trim().split(' ')[0] || 'Admin';

          this.adminName =
            'Welcome ' + firstName + ' !';

          setTimeout(() => {
            this.adminName = '';
          }, 2000);
        }

      },
      error: (error) => {
        console.error('Error fetching admin details:', error);
      }
    });
  }

  // =========================================================
  // USER LIST
  // =========================================================

  showUserList(): void {

    this.userList = true;
    this.poster = false;
    this.updates = false;
  }

  showPoster(): void {

    this.userList = false;
    this.poster = true;
    this.updates = false;
  }

  // =========================================================
  // GET USER DETAILS
  // =========================================================

  get_This_User(id: any): void {

    this.adminApi.get_user(id).subscribe({
      next: (user: any) => {

        if (user?.data) {

          this.user_detail = user.data;

          this.updates = true;
          this.poster = false;
          this.userList = false;

          this.formData.user_id =
            this.user_detail.user_id;

          this.formData.user_name =
            this.user_detail.user_name;

          this.formData.user_email =
            this.user_detail.user_email;

          this.formData.user_mobile =
            this.user_detail.user_mobile;

          this.formData.user_password = '';
          this.formData.confirm_password = '';
          this.wrongPass = '';
        }

      },
      error: (error) => {

        console.error('Error fetching user:', error);

        this.toastr.error(
          'Unable to fetch user details.',
          'Error',
          {
            progressBar: true,
            disableTimeOut: false,
            closeButton: true
          }
        );
      }
    });
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  updateUser(): void {

    this.wrongPass = '';

    if (
      this.formData.user_password !==
      this.formData.confirm_password
    ) {

      this.wrongPass =
        'Passwords do not match.!!';

      setTimeout(() => {
        this.wrongPass = '';
      }, 3000);

      return;
    }

    const formData = new FormData();

    const id = this.formData.user_id;

    formData.append(
      'user_name',
      this.formData.user_name || ''
    );

    formData.append(
      'user_email',
      this.formData.user_email || ''
    );

    formData.append(
      'user_mobile',
      this.formData.user_mobile || ''
    );

    formData.append(
      'user_password',
      this.formData.user_password || ''
    );

    this.updatingUser = true;

    this.adminApi.updateUser(id, formData)
      .pipe(
        finalize(() => {
          this.updatingUser = false;
        })
      )
      .subscribe({
        next: (data: any) => {

          if (data?.success) {

            this.toastr.success(
              data.message || 'User updated successfully.',
              'Success',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            this.resetUserForm();

            this.userList = true;
            this.poster = false;
            this.updates = false;

            // Refresh counts/list without showing dashboard skeleton.
            this.loadDashboardData(false);

          } else {

            this.toastr.error(
              data?.error || 'Failed to update user.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }

        },
        error: (error) => {

          console.error('Error updating user:', error);

          this.toastr.error(
            'Something went wrong while updating the user.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }

  // =========================================================
  // DELETE USER
  // =========================================================

  delete_This_User(id: any): void {

    if (this.deletingUserId !== null) {
      return;
    }

    this.deletingUserId = id;

    this.adminApi.deleteUser(id)
      .pipe(
        finalize(() => {
          this.deletingUserId = null;
        })
      )
      .subscribe({
        next: (data: any) => {

          if (data?.success) {

            this.toastr.success(
              data.message || 'User deleted successfully.',
              'Success',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );

            // Refresh dashboard data only.
            this.loadDashboardData(false);

          } else {

            this.toastr.error(
              data?.error || 'Failed to delete user.',
              'Error',
              {
                progressBar: true,
                disableTimeOut: false,
                closeButton: true
              }
            );
          }

        },
        error: (error) => {

          console.error('Error deleting user:', error);

          this.toastr.error(
            'Something went wrong while deleting the user.',
            'Error',
            {
              progressBar: true,
              disableTimeOut: false,
              closeButton: true
            }
          );
        }
      });
  }

  // =========================================================
  // RESET USER FORM
  // =========================================================

  private resetUserForm(): void {

    this.formData = {
      user_id: '',
      user_name: '',
      user_email: '',
      user_mobile: '',
      user_password: '',
      confirm_password: ''
    };

    this.wrongPass = '';
  }

}