import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '@coreui/coreui';
import { AdminApiService } from '../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements AfterViewInit {

  constructor(private el: ElementRef, public adminApi: AdminApiService, private router: Router, private toastr:ToastrService) { }
  
  sidebar: Sidebar | null = null;

  ngAfterViewInit(): void {
    const sidebarElement = document.querySelector('#sidebar') as HTMLElement;
    if (sidebarElement) {
      this.sidebar = Sidebar.getOrCreateInstance(sidebarElement);
      this.sidebar.hide(); //Hide the Sidebar by default
    }
  }

  toggleSidebar(): void {
    if (this.adminApi.isAdminLoggedIn()) {
      if (this.sidebar) {
        this.sidebar.toggle();
      } else {
        console.error('Sidebar instance not found!');
      }
    }
    else
    {
      this.toastr.warning('Login First to view Sidebar', 'Warning', { disableTimeOut: false, progressBar: true })
    }
  }

  dropdownOpen = false;
  toggleDropdown(event: Event) {
    event.preventDefault();
    this.dropdownOpen = !this.dropdownOpen;
  }

  //Here are Dropdown instances
  productDropdownOpen = false;
  whyChooseDropdownOpen = false;
  blogDropdownOpen = false;
  teamDropdownOpen = false;
  manageDropdownOpen = false;

  // Toggle Team Dropdown
toggleTeamDropdown(event: Event): void {
  event.preventDefault();
  this.teamDropdownOpen = !this.teamDropdownOpen;
}

// Toggle Manage Dropdown
toggleManageDropdown(event: Event): void {
  event.preventDefault();
  this.manageDropdownOpen = !this.manageDropdownOpen;
}

// Toggle Product Dropdown
toggleProductDropdown(event: Event): void {
  event.preventDefault();
  this.productDropdownOpen = !this.productDropdownOpen;
}

// Toggle Why Choose Us Dropdown
toggleWhyChooseDropdown(event: Event): void {
  event.preventDefault();
  this.whyChooseDropdownOpen = !this.whyChooseDropdownOpen;
}

// Toggle Blog Dropdown
toggleBlogDropdown(event: Event): void {
  event.preventDefault();
  this.blogDropdownOpen = !this.blogDropdownOpen;
}

  ngOnInit() {
    this.getAdminProfile();
    // For View login admin Profile
    this.adminApi.adminState$.subscribe((admin) => {
      this.adminDetails = admin;
      if (this.adminDetails?.admin_profile != null && this.adminDetails?.admin_profile !== '') {
        this.adminProfile = `http://localhost:1000/uploads/${this.adminDetails.admin_profile}`;
      }
      else {
        this.getAdminProfile();
      }
    });
  }

  adminDetails: any;
  adminProfile: any;
  adminName: string = '';
  adminInitials: string = '';
  getAdminProfile() {
    this.adminApi.getAdminDetails()?.subscribe((data: any) => {
      if (data.success) {
        this.adminDetails = data.admin;
        this.adminName = 'Welcome ' + this.adminDetails.admin_name + '!';
        if (this.adminDetails?.admin_profile != null && this.adminDetails?.admin_profile !== '') {
          this.adminProfile = `http://localhost:1000/uploads/${this.adminDetails?.admin_profile}`;
        } else {
          this.adminInitials = this.getInitials(this.adminDetails?.admin_name);
        }
      }
    })
    setTimeout(() => {
      this.adminName = '';
    }, 4000);
  }

  getInitials(admin_name: string): string {
    if (!admin_name) {
      return 'Furni';
    }
    const name = admin_name.trim();
    const nameParts: string[] = name.split(' ');
    const initials = nameParts.map((part: string) => part.charAt(0).toUpperCase()).slice(0, 2).join('');
    return initials;
  }

  // Admin Logout
  logout() {
    this.adminApi.adminLogout();
    this.adminProfile = null;
    this.router.navigate(['/admin/login']);
    this.getAdminProfile();
    const sidebarElement = document.querySelector('#sidebar') as HTMLElement;
    if (sidebarElement) {
      this.sidebar = Sidebar.getOrCreateInstance(sidebarElement);
      this.sidebar.hide(); //Hide the Sidebar when admin is logout
    }
  }


}
