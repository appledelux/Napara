import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = '';
  friendEmail: string = '';
  user: User;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private userService: UserService,
    private requestsService: RequestsService,
    private authService: AuthService) {
    this.userService.getUsers().valueChanges().subscribe(
      (data: User[]) => {
        this.friends = data;
      },
      err => console.log(err));
    this.authService.getStatus().subscribe(status => {
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
      });
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(
      (data) => this.router.navigate(['/login']),
      err => console.log(err));
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    };

    this.requestsService.createRequest(request).then(() => {
      alert('Solicitud Enviada');
    }).catch(err => console.log(err));

  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }


}
