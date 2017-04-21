import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


import * as firebase from "firebase";
import { FIREBASE_CONFIG, NEO4J_CONFIG } from "../../APP_SECRETS";
firebase.initializeApp(FIREBASE_CONFIG);

import { AuthData } from '../providers/auth-data';
import { NeoService } from './neo-service';

import { Event } from '../models/event';
import { SubscriptionType } from '../models/subscriptiontype';

@Injectable()
export class UserService {
  neo: NeoService;
  authData: AuthData;

  constructor() {
    this.neo = new NeoService();
    this.authData = new AuthData();
  }





}
