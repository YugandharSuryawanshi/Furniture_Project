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

  ngOnInit()
  {
    this.check();
  }
  check()
  {
    const temp= this.userApi.isUserLoggedIn();
    console.log('Is User Login Or Not'+temp);
  }
  

}
