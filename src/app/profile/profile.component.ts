import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  user: User;
  picture: any;
  constructor(
    private firebaseStorage: AngularFireStorage,
    private authService: AuthService,
    private userService: UserService) {
    this.authService.getStatus().subscribe(
      status => this.userService.getUserById(status.uid).valueChanges().subscribe(
        (user: User) => this.user = user,
        err => console.log(err)
      ),
      err => console.log(err)
    );
  }

  ngOnInit() {
  }

  saveSettings() {
    if (this.imageCropped) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref(`pictures/${currentPictureId}.jpg`)
        .putString(this.croppedImage, 'data_url');
      pictures
        .then(result => {
          return new Promise((resolve, reject) => {
            this.firebaseStorage
              .ref(`pictures/${currentPictureId}.jpg`)
              .getDownloadURL().subscribe(p => {
                this.userService.setAvatar(p, this.user.uid)
              .then(() => alert('Avatar Subido Correctamente'))
              .catch(err => alert('Hubo un error al subir el avatar.'));
              });
        });
    }).catch (err => console.log(err));


  } else {
  this.userService.editUser(this.user).then(
    (data) => {
      alert('Cambios Guardados');
    })
    .catch(err => alert('Hubo un error'));
}

  }

fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
}
imageLoaded() {
  // show cropper
}
loadImageFailed() {
  // show message
}

}
