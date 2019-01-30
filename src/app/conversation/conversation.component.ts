import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  flagShake: boolean = false;
  croppedImage: any;
  pictureMessage: any;
  showModal: boolean;
  inputImage: any;
  imageChangedEvent: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private conversationService: ConversationService,
    private angularFireStorage: AngularFireStorage,
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
      sender: this.user.uid,
      type: 'text'
    };
    this.conversationService.createConversation(message)
      .then(() => {
        this.textMessage = '';
      })
      .catch(err => console.log(err));
  }

  sendZumbido() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      receiver: this.friend.uid,
      sender: this.user.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message)
      .then(() => {

      })
      .catch(err => console.log(err));
    this.doZumbido();
  }

  doZumbido() {
    const audio = new Audio(`assets/sound/zumbido.m4a`);
    audio.play();
    this.flagShake = true;
    window.setTimeout(() => {
      this.flagShake = false;
    }, 1000);
  }

  getConversation() {
    this.conversationService.getConversationById(this.conversation_id).valueChanges().subscribe(
      (data) => {
        this.listConversation = data;
        this.listConversation.map(message => {
          if (!message.seen) {
            message.seen = true;
            this.conversationService.editConversation(message);
            if (message.type == 'text') {
              const audio = new Audio(`assets/sound/new_message.m4a`);
              audio.play();
            } else if (message.type = 'zumbido') {
              this.doZumbido();
            }

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

  sendImage() {
    const currentImageId = Date.now();
    try {
      this.angularFireStorage.ref(`messagesPictures/${currentImageId}|${this.conversation_id}.jpg`)
        .putString(this.croppedImage, 'data_url');
      this.pictureMessage = this.angularFireStorage.ref(`messagesPictures/${currentImageId}|${this.conversation_id}.jpg`).getDownloadURL()
    } catch (error) {
      console.log(error);
    }

    this.pictureMessage.subscribe(async url => {
      const message = {
        uid: this.conversation_id,
        timestamp: Date.now(),
        text: url,
        sender: this.user.uid,
        receiver: this.friendId,
        type: 'image'
      };

      try {
        this.conversationService.createConversation(message);
        this.showModal = false;
        this.croppedImage = '';
        this.inputImage.nativeElement.value = '';
      } catch (err) {
        console.log(err);
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

}
