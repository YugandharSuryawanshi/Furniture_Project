import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { BannerComponent } from './banner/banner.component';
import { BlogListsComponent } from './blog-lists/blog-lists.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { InteriorDesignComponent } from './interior-design/interior-design.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { WhyChooseUsPointsComponent } from './why-choose-us-points/why-choose-us-points.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { SettingComponent } from './setting/setting.component';
import { AuthGuard } from '../auth.guard';
import { OrdersComponent } from './orders/orders.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

const routes: Routes = [
  { path: 'login', component: AdminLoginComponent }, // Allow login without authentication
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default admin route
  { path:'register', component: RegisterComponent }, // Allow registration without authentication
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'admin',requiresLogin: true } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'banner', component: BannerComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'product_type', component: ProductTypeComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'product_list', component: ProductListComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'interior_design', component: InteriorDesignComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'testimonials', component: TestimonialComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'why_choose_us', component: WhyChooseUsComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'why_choose_us_points', component: WhyChooseUsPointsComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'blog_list', component: BlogListsComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'our_team', component: OurTeamComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'contact_us', component: ContactUsComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true } },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true }  },
  { path: 'update-order/:id', component: UpdateOrderComponent, canActivate: [AuthGuard], data: { role: 'admin' , requiresLogin: true }  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
