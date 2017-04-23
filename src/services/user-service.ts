import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";
import { FIREBASE_CONFIG, NEO4J_CONFIG } from "../../APP_SECRETS";

import { AuthData } from '../providers/auth-data';
import { NeoService } from './neo-service';

import { Event } from '../models/event';
import { SubscriptionType } from '../models/subscriptiontype';
import { User } from '../models/user';

@Injectable()
export class UserService {
  neo: NeoService;
  authData: AuthData;
  firebaseId: any;

  constructor() {
    this.neo = new NeoService();
    this.authData = new AuthData();
  }

  fetchUserData(){
  	return firebase.database().ref('/user/' + this.authData.getFirebaseId()).once('value').then((snapshot) => {
        let u = new User();
        u.name = snapshot.val().name;
        u.email = snapshot.val().email;
        u.year = snapshot.val().year;
        return u;
  	})

  }

}
