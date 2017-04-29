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

	fetchUpcomingEventsForCalendar(calendarId) {
		var query = `
						MATCH (c:Calendar {id: {calendarId}})-[:HOSTING]->(e:Event)
					 	WHERE e.date >= timestamp()/1000
						OPTIONAL MATCH (u: FBUser)-[ti:INTERESTED]->(e)
						OPTIONAL MATCH (fu: FBUser {firebaseId: {firebaseId}})-[ui:INTERESTED]->(e)
						with count(ti) as ti, e, c, count(ui) > 0 as ui order by e.date
						with collect({event:e, calendar: c, totalInterestLevel:ti, isUserInterested:ui}) as res
						return res
					`;
		var params = {calendarId: calendarId, firebaseId: this.authData.getFirebaseId()};
		return this.neo.runQuery(query, params).then((results) => {
			let data: Object[] = results[0];
			return data.map(this.parseEventData);
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
		var query = `
						MATCH (e:Event)
						WHERE e.date >= timestamp()/1000
						MATCH (c: Calendar)-[:HOSTING]->(e)
						OPTIONAL MATCH (u: FBUser)-[ti:INTERESTED]->(e)
						OPTIONAL MATCH (fu: FBUser {firebaseId: {firebaseId}})-[ui:INTERESTED]->(e)
						with count(ti) as ti, e, c, count(ui) > 0 as ui order by e.date
						with collect({event:e, calendar: c, totalInterestLevel:ti, isUserInterested:ui}) as res
						return res
					`;
		var params = {firebaseId: this.authData.getFirebaseId()};
		return this.neo.runQuery(query, params).then((results) => {
			console.log(results[0]);
			let data: Object[] = results[0];
			return data.map(this.parseEventData);
			// return this.parseEvents(results);
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
      		return results.map(this.parseEventDataOld);
    	});
  	}


	markCurrentUserInterestedInEvent(eventId) {
		var query = `	MATCH (e:Event)
					 	WHERE ID(e) = {eventId}
						MATCH (u:FBUser)
						WHERE u.firebaseId = {userId}
						CREATE UNIQUE (u)-[r:INTERESTED]->(e)
						RETURN u
					`;
		var params = {eventId: eventId, userId: this.authData.getFirebaseId()};
		return this.neo.runQuery(query, params).then((results) => {
			return results;
		});
	}

	unmarkCurrentUserInterestedInEvent(eventId) {
		var query =	`
						MATCH (u: FBUser)-[r:INTERESTED]->(e: Event)
						WHERE ID(e) = {eventId} AND u.firebaseId = {userId}
						DELETE r
                    `;
        var params = {userId: this.authData.getFirebaseId(), eventId: eventId}
        return this.neo.runQuery(query, params).then((results) => {
                return results;
        });
	}

	parseEventDataOld(data) {
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

	parseEventData(data) {
		let e = new Event();

		// Info from event
		e.name = data.event.name;
		e.id = data.event.id;
		e.desc = data.event.desc;
		e.date = data.event.date;
		e.img = data.event.img;
		e.calendartype = 'Calendar Type';
		e.place = data.event.location;
		e.summary = data.event.summary;

		// Info from calendar
		e.calendarId = data.calendar.id;
		e.host = data.calendar.name;

		e.userIsInterested = data.isUserInterested;
		e.interestCount = data.totalInterestLevel;
		return e;
	}
}
