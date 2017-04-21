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


  subscribeUserToCalendar(calendarId) {
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


  unsubscribeUserFromCalendar(calendarId) {
    var query = `  MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar {id: {calendarId}}) 
            DELETE r  
          `;
    var params = {calendarId: calendarId, userId: this.authData.getFirebaseId()};
    return this.neo.runQuery(query, params).then((results) => {
      return results;
    });  
  }

  

  // getUserSubscriptions(id){
  //   return firebase.database().ref('/user/' + id + '/subscriptions').once('value').then((snapshot) => {
  //     if (snapshot.val() === null){
  //       return undefined;
  //     }
  //     var subscriptions = snapshot.val();

  //     return Object.keys(subscriptions).map(function(key){
  //     	return subscriptions[key];
  // 	  })

  // 	})
  //  }

  // updateUserSubscriptions(id, item){
  // 	var database = firebase.database();
  // 	var in_list = false;
  //   this.getUserSubscriptions(id).then((sub) => {
  //   	if (sub.length > 0){
	 //    	if (sub.indexOf(item) >= 0){
	 //    		in_list = true;
	 //    	}
	 //    	if (!in_list){
	 //    		var postListRef = database.ref('user/' + id + '/subscriptions').push(item);
	 //    	}
  //   	}
  //   	else{
  //   		//database.ref().push('user/' + id + '/subscriptions/' + item)
  //   	}


  //   });
  // }

 //  removeUserSubscriptions(id, item){
 //  	var database = firebase.database();
 //  	var keytodelete = '';
 //  	var in_list = false;
 //  	// console.log(item);
 //  	this.getUserSubscriptions(id).then((sub) => {
 //    	if (sub.indexOf(item) >= 0){
 //    		in_list = true;
 //    	}
 //      console.log('item to delete ' + item);
 //      console.log(in_list)
 //    	if (in_list){
 //    		database.ref('user/' + id + '/subscriptions').once('value').then((snapshot) => {
	//   		snapshot.forEach(function(childSnapshot) {
	// 	    var childKey = childSnapshot.key;
	// 	    var childData = childSnapshot.val();
	// 	    if (childData == item){
	// 	    	keytodelete = childKey;

 //          var adref = database.ref('user/' + id + '/subscriptions/');
 //          adref.child(keytodelete).remove();
	// 	    }
	//   });
	// });

 //    }

 //    });


 //  }

 //  fetchEventsPersonal(id){

 //  	var list_user_subs = new Array();
 //    if (this.getUserSubscriptions(id) === undefined){
 //      console.log('wow')
 //      return undefined;
 //    }
 //    else{
 //      this.getUserSubscriptions(id).then((sub) => {
 //      // console.log(sub)
 //      list_user_subs = sub;
 //       });
 //      return firebase.database().ref('/calendar/').once('value').then((snapshot) => {
 //        var data = snapshot.val();
 //        let events = [];
 //        list_user_subs.forEach((sub) => {
 //          // console.log(sub);
 //          events = events.concat(data[sub].map(this.eventJSONtoEventObj));
 //        });

 //        events.sort(function (lhs, rhs) {
 //          return ~~(lhs.date > rhs.date);
 //        });

 //        return events;
 //      });

 //    }

	// // console.log(this.getUserSubscriptions(1));

 //  }

  // eventJSONtoEventObj(json) {
		// var e = new Event();
		// e.name = json.name;
		// e.desc = json.desc;
		// e.date = json.date;
		// e.img = json.img;
		// e.calendartype = json.calendartype;
		// e.host = json.host;
		// e.place = json.place;
		// return e;
  // }

  // fetchCalendars(id) {
		// return firebase.database().ref('/calendar/').once('value').then((snapshot) => {
		// 	var calendars = snapshot.val();
		// 	let list_sub = [];

		// 	return this.getUserSubscriptions(id).then((itr) => {

		// 		Object.keys(calendars).forEach((cal) => {

		// 			console.log(itr);
		// 			list_sub = list_sub.concat(this.setCalSubs(cal, itr));

		// 		});
		// console.log(list_sub);
		// return list_sub;
  //  	});
		// })
  // }

  // fetchCalendarHelper(){
  // 	var in_list = false;
  // 	var list_user_subs = new Array();
		// var sub = new SubscriptionType();
  // 	// Some Asynchronous stuff going on -> need to populate
		// this.getUserSubscriptions(id).then((itr) => {
  // 		list_user_subs = itr;
		// 	console.log(itr);
		// 	console.log(list_user_subs);
		// 	return itr
  //   });

  // }

	// setCalSubs(cal, list_u_s){
	// 	var sub = new SubscriptionType();
	// 	sub.calendartype = cal;
	// 	sub.icon = 'close-circle';
	// 	console.log(list_u_s)
	// 	if (list_u_s.indexOf(cal) > -1) {
	// 		sub.icon = 'checkmark';
	// 	}

	// 	return sub;
	// }

}
