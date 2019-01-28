import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any;
  friend: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    this.userService.getUserById(this.friendId).valueChanges().subscribe(
      (data: User) => this.friend = data,
      (err) => console.log(err)
    );
  }

  ngOnInit() {
  }

}
