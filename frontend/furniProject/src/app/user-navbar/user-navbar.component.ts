import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../service/user-api.service';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {

  constructor( public userApi:UserApiService ){}

  activeLink: string = 'home';
  setActive(link: string) {
    this.activeLink = link;
  }
  isActive(link: string): boolean {
    return this.activeLink === link;
  }


  isNavbarCollapsed = false;
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
