import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  listConversation: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private conversationService: ConversationService,
    private userService: UserService) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    this.getUserAndFriend();
  }

  ngOnInit() {

  }

  getUserAndFriend() {
    this.authService.getStatus()
      .subscribe((session) => {
        this.userService.getUserById(session.uid)
          .valueChanges()
          .subscribe((user: User) => {
            this.user = user;
            this.userService.getUserById(this.friendId).valueChanges().subscribe(
              (data: User) => {
                this.friend = data;
                const ids = [this.user.uid, this.friend.uid].sort();
                this.conversation_id = ids.join('|');
                this.getConversation();
              },
              (err) => console.log(err)
            );
          });
      });
  }

  sendMessage() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      receiver: this.friend.uid,
      sender: this.user.uid
    };
    this.conversationService.createConversation(message)
      .then(() => {
        alert('Mensaje creado con exito');
        this.textMessage = '';
      })
      .catch(err => console.log(err));
  }

  getConversation() {
    this.conversationService.getConversationById(this.conversation_id).valueChanges().subscribe(
      (data) => {
        this.listConversation = data;
        this.listConversation.map(message => {
          if (!message.seen) {
            message.seen = true;
            this.conversationService.editConversation(message);
            const audio = new Audio(`assets/sound/new_message.m4a`);
            audio.play();
          }
        });
      },
      (err) => { console.log(err); });
  }

  getUserNickById(id: any) {
    if (id === this.friendId) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }

}
