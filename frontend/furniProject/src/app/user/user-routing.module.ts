import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ShopComponent } from './shop/shop.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { UserAuthGuard } from '../user-auth.guard';
import { HomeComponent } from './home/home.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { CartComponent } from './cart/cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PrintReceiptComponent } from './print-receipt/print-receipt.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'product_info/:id', component: ProductInfoComponent},
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [UserAuthGuard], data: { role: 'user' , requiresLogin: true } },
  { path: 'contact', component: ContactComponent, canActivate: [UserAuthGuard], data: { role: 'user' , requiresLogin: true } },
  { path: 'orders', component: MyOrdersComponent, canActivate: [UserAuthGuard], data: { role: 'user' , requiresLogin: true}},
  { path: 'print_receipt/:order_id', component: PrintReceiptComponent, canActivate: [UserAuthGuard], data: { role: 'user' , requiresLogin: true}},
  { path: 'checkout', component: CheckoutComponent, canActivate: [UserAuthGuard], data: { role: 'user' , requiresLogin: true}},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
