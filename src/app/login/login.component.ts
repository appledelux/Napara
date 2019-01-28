import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  operation: string = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.loginWithEmail(this.email, this.password)
      .then(data => this.router.navigate(['home']))
      .catch(err => {
        alert(`Ha ocurrido un error`);
        console.log(err);
      });
  }

  register() {
    this.authService.registerWithEmail(this.email, this.password)
      .then(data => {
        const user = {
          uid: data.user.uid,
          email: this.email,
          nick: this.nick
        };
        this.userService.createUser(user).then(data2 => {
          alert(`Registrado Correctamente, ${data}`);
        }).catch(err2 => alert(`Ha ocurrido un error: ${err2}`));
      }
      )
      .catch(err => alert(`Ha ocurrido un error: ${err}`));
  }

}
