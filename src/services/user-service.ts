import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";

// import { Event } from '../models/event';

@Injectable()
export class UserService {
  getUserSubscriptions(id){
    return firebase.database().ref('/user/' + id + '/subscriptions').once('value').then((snapshot) => {
      var subscriptions = snapshot.val();
      console.log(subscriptions);
      return subscriptions;
    });
  }

}
