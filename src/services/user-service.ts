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


  subscribeCurrentUserToCalendar(calendarId) {
    var query = `  MATCH (c:Calendar)                     
            WHERE c.id = {cId}
            MATCH (u:FBUser)                      
            WHERE u.firebaseId = {userId}                  
            CREATE (u)-[r:SUBSCRIBED]->(c)              
            RETURN u                         
          `;
  var params = {cId: calendarId, userId: this.authData.getFirebaseId()};
    return this.neo.runQuery(query, params).then((results) => {
      return results;
    });
  }


  unsubscribeCurrentUserFromCalendar(calendarId) {
    var query = `  MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar {id: {calendarId}}) 
            DELETE r  
          `;
    var params = {calendarId: calendarId, userId: this.authData.getFirebaseId()};
    return this.neo.runQuery(query, params).then((results) => {
      return results;
    });  
  }

}
