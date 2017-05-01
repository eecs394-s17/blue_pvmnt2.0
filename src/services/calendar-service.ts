import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";
import { FIREBASE_CONFIG, NEO4J_CONFIG } from "../../APP_SECRETS";
firebase.initializeApp(FIREBASE_CONFIG);

import { Event } from '../models/event';
import { Calendar } from '../models/calendar';
import { NeoService } from './neo-service';
import { AuthData } from '../providers/auth-data';

@Injectable()

export class CalendarService {
	neo: NeoService;
	authData: AuthData;


	constructor() {
		this.neo = new NeoService();
		this.authData = new AuthData();
	}

	isUserSubscribed(calendarId){
		var query =`	
						MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar)
						WHERE ID(c) = {calendarId}
						RETURN r
					`;
		var params = {userId: this.authData.getFirebaseId(), calendarId: calendarId};

		return this.neo.runQuery(query, params).then((results) => {
			if (Object.keys(results).length == 0){
				return false;
			}
			else{
				return true;
			}

		});
	}

	subscribeCurrentUserToCalendar(calendarId) {
    	var query = `	
    					MATCH (c:Calendar)
			            WHERE ID(c) = {calendarId}
			            MATCH (u:FBUser)
			            WHERE u.firebaseId = {userId}
			            CREATE (u)-[r:SUBSCRIBED]->(c)
			            RETURN u
          			`;
  		var params = {calendarId: calendarId, userId: this.authData.getFirebaseId()};
    	return this.neo.runQuery(query, params).then((results) => {
      		return results;
    	});
  	}


  	unsubscribeCurrentUserFromCalendar(calendarId) {
    	var query = `	
						MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar)
						WHERE ID(c) = {calendarId}
            			DELETE r
          			`;
	    var params = {calendarId: calendarId, userId: this.authData.getFirebaseId()};
	    return this.neo.runQuery(query, params).then((results) => {
	      return results;
	    });
	}

	fetchAllCalendars(){
		var query = `	
						MATCH (c:Calendar)
						RETURN c
					`;

		return this.neo.runQuery(query, {}).then((results: Calendar[]) => {
			return results.map(this.parseCalendarData);
		}) ;
	}

	fetchCurrentUserCalendars() {
		var subsQuery = `
							MATCH (u: FBUser {firebaseId: {firebaseId}})-[:SUBSCRIBED]->(c:Calendar)
							RETURN c
						`;
		var params = {firebaseId: this.authData.getFirebaseId()};
		return this.neo.runQuery(subsQuery, params).then((subs: Object[]) => {
			var unsubsQuery = `
								MATCH (u: FBUser {firebaseId: {firebaseId}})-[:SUBSCRIBED]->(c:Calendar)
								WITH collect(c) as subs
								MATCH (unsubs: Calendar)
								WHERE NOT(unsubs in subs)
								RETURN unsubs
							`;
			return this.neo.runQuery(unsubsQuery, params).then((unsubs: Object[]) => {
				let subbedCalendars = subs.map(c => this.parseCalendarData(c, true));
				let unsubbedCalendars = unsubs.map(c => this.parseCalendarData(c, false));
				let allCalendars = subbedCalendars.concat(unsubbedCalendars);
				allCalendars.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
				return allCalendars;
			});
		});

	}

	parseCalendarData(data, subscribed) {
		let c = new Calendar();
		c.name = data.name;
		c.id = data.id;
		c.subscribed = subscribed;
		return c
	}

}
