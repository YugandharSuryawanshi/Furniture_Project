import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '@coreui/coreui';
import { AdminApiService } from '../service/admin-api.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements AfterViewInit {

  constructor(private el: ElementRef, public adminApi:AdminApiService, private router:Router) {}
  private sidebar!: Sidebar;

  ngAfterViewInit(): void {
    this.getAdminProfile();
    const sidebarElement = document.querySelector('#sidebar');
    if (sidebarElement) {
      this.sidebar = Sidebar.getOrCreateInstance(sidebarElement);
    }
  }

  toggleSidebar(): void {
    if (this.sidebar) {
      this.sidebar.toggle();
    } else {
      console.error('Sidebar instance is not initialized.');
    }
  }

  dropdownOpen = false;
  toggleDropdown(event: Event) {
    event.preventDefault(); // Prevent default behavior of the <a> tag
    this.dropdownOpen = !this.dropdownOpen;
  }

  productDropdownOpen = false; // State for Product dropdown
  whyChooseDropdownOpen = false; // State for Why Choose Us dropdown
  blogDropdownOpen = false;
  teamDropdownOpen = false;

  toggleProductDropdown(event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.productDropdownOpen = !this.productDropdownOpen;
  }

  toggleWhyChooseDropdown(event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    this.whyChooseDropdownOpen = !this.whyChooseDropdownOpen;
  }

  // Toggle Blog Dropdown
  toggleBlogDropdown(event: Event): void {
    event.preventDefault(); // Prevent default behavior of the <a> tag
    this.blogDropdownOpen = !this.blogDropdownOpen;
  }


  // Toggle function for Our Team dropdown
  toggleTeamDropdown(event: Event): void {
    event.preventDefault(); // Prevent default behavior of the <a> tag
    this.teamDropdownOpen = !this.teamDropdownOpen;
  }

  

  ngOnInit()
  {
    this.getAdminProfile();
    // For admin state changes
    this.adminApi.adminState$.subscribe((admin) => {
      this.adminDetails = admin;
      this.adminProfile = `http://localhost:1000/uploads/${this.adminDetails.admin_profile}`;
    });
  }

  adminDetails:any;
  adminProfile: any;
  adminName:string = '';
  getAdminProfile()
  {
    this.adminApi.getAdminDetails()?.subscribe((data:any)=>{
      if(data.success)
      {
        this.adminDetails = data.admin;
        this.adminProfile = `http://localhost:1000/uploads/${this.adminDetails.admin_profile}`;
        this.adminName = 'Welcome '+this.adminDetails.admin_name + '!';
      }
      else {
        this.adminProfile = "C:\Users\ADMIN\OneDrive\Desktop\RadheKrishna.jpg";
      }
    })
    setTimeout(() => {
      this.adminName = '';
    }, 4000);
  }


  logout() {
    this.adminApi.adminLogout();
    this.adminProfile = null;
    this.router.navigate(['/admin/login']);
    this.getAdminProfile();
  }



}
