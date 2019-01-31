import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import {Upload} from '../../app.component';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UploadService {

  constructor() { }

  url;

  private basePath = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;

  getUrl() {
    return this.url;
  }


  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          console.log('tipo' , typeof downloadURL);
          this.url = downloadURL;
        });
      }
    );
  }
}
