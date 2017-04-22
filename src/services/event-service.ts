import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Event } from '../models/event';
import { NeoService } from './neo-service';
import { AuthData } from '../providers/auth-data'

@Injectable()
export class EventService {
	neo: NeoService;
	authData: AuthData;

	constructor() {
		this.neo = new NeoService();
		this.authData = new AuthData();
	}

<<<<<<< HEAD
	fetchUpcomingEventsForCalendar(calendarID) {
		var query = `	MATCH (c:Calendar) 										
					 	WHERE c.id = {calendarId}							
						MATCH (e:Event)											
						WHERE (c)-[:HOSTING]->(e) AND e.date >= timestamp()/1000	
						SET e.host = c.name 	
						SET e.calendarId = c.id								
						RETURN e 												
=======
	fetchUpcomingEventsForCalendar(calendar) {
		var query = `	MATCH (c:Calendar)
					 	WHERE c.name = {calendarName}
						MATCH (e:Event)
						WHERE (c)-[:HOSTING]->(e) AND e.date >= timestamp()/1000
						SET e.host = c.name
						SET e.calendarId = c.id
						RETURN e
>>>>>>> d13d58a6a6faf519f535b40fae635cc7ab9da814
					`;
		var params = {calendarId: calendarID};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});
	}

	subscribeUserToCalendar(user, calendar) {
		var query = `	MATCH (c:Calendar)
					 	WHERE c.name = {calendarName}
						MATCH (u:User)
						WHERE u.id = {userId}
						CREATE UNIQUE (u)-[r:SUBSCRIBED]->(c)
						RETURN u
					`;
		var params = {calendarName: calendar, userId: user};
		return this.neo.runQuery(query, params).then((results) => {
			return results;
		});
	}

	interestedUserToEvent(user, eventID) {
		var query = `	MATCH (e:Event)
					 	WHERE ID(e) = {eventId}
						MATCH (u:FBUser)
						WHERE u.firebaseId = {userId}
						CREATE UNIQUE (u)-[r:INTERESTED]->(e)
						RETURN u
					`;
		var params = {eventId: eventID, userId: this.authData.getFirebaseId()};
		console.log(user);
		console.log(eventID);
		console.log(user);
		return this.neo.runQuery(query, params).then((results) => {
			return results;
		});
	}

	userIsInterestedIn(){
        var query =`MATCH (u:FBUser)-[r:INTERESTED]->(e:Event)
                                WHERE u.firebaseId = {uid}
                                RETURN e
                                `
        var params = {uid: this.authData.getFirebaseId()}

        return this.neo.runQuery(query, params).then((results) => {
            return results;
        });
    }

	fetchAllUpcomingEvents() {
		var query = `	MATCH (c:Calendar)-[:HOSTING]->(e:Event)
						WHERE e.date >= timestamp()/1000
						SET e.host = c.name
						SET e.calendarId = c.id
						RETURN e
						ORDER BY e.date
					`;
		var params = {};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			console.log(results);
			return results.map(this.parseEventData);
		});
	}

	fetchInterestedEventsForCurrentUser() {
		var query =`	MATCH (u:FBUser {firebaseId: {userId}})-[:INTERESTED]->(e:Event)
                        RETURN e
                    `;
        var params = {userId: this.authData.getFirebaseId()}
        return this.neo.runQuery(query, params).then((results) => {
        	return results;
        });
	}

	fetchUpcomingEventsForCurrentUser() {
    	var query = `	MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar)
            			MATCH (c)-[:HOSTING]->(e: Event)
            			WHERE e.date >= timestamp()/1000
           				SET e.host = c.name
            			SET e.calendarId = c.id
            			RETURN e
            			ORDER BY e.date
          			`;
    	var params = {userId: this.authData.getFirebaseId()};
    	return this.neo.runQuery(query, params).then((results: Event[]) => {
      		return results.map(this.parseEventData);
    	});
  	}

  	// Not working right now
	markCurrentUserInterestedInEvent(eventID) {
		var query = `	MATCH (e:Event)
					 	WHERE ID(e) = {eventId}
						MATCH (u:FBUser)
						WHERE u.firebaseId = {userId}
						CREATE UNIQUE (u)-[r:INTERESTED]->(e)
						RETURN u
					`;
    var params = {userId: this.authData.getFirebaseId(), eventId: eventID}
    return this.neo.runQuery(query, params).then((results) => {
        return results;
    });
	}

	unmarkCurrentUserInterestedInEvent(eventId) {
		var query =	`
						MATCH (u: FBUser {firebaseId: {userId}})-[r:INTERESTED]->(e: Event {id: {eventId}}))
						DELETE r
                    `;
        var params = {userId: this.authData.getFirebaseId(), eventId: eventId}
        return this.neo.runQuery(query, params).then((results) => {
                return results;
        });
	}

	parseEventData(data) {
		let e = new Event();
		e.name = data.name;
		e.id = data.id;
		e.desc = data.desc;
		e.date = data.date;
		e.img = data.img;
		e.host = data.host;
		e.calendartype = 'Calendar Type';
		e.place = data.location;
		e.calendarId = data.calendarId;
		e.summary = data.summary;
		return e;
	}
}
