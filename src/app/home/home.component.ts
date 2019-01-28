import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService) {
    this.userService.getUsers().valueChanges().subscribe(
      (data: User[]) => {
        this.friends = data;
      },
      err => console.log(err));
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(
      (data) => this.router.navigate(['/login']),
      err => console.log(err));
  }

}
