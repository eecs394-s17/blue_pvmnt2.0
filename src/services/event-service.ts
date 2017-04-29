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

	fetchUpcomingEventsAndReccomendationsForCurrentUser() {
		var recQuery = `
						MATCH (me: FBUser {firebaseId: {firebaseId}})
						MATCH (me)-[:INTERESTED]->(myInterests:Event)
						OPTIONAL MATCH (other: FBUser)-[:INTERESTED]->(myInterests)
						OPTIONAL MATCH (other)-[:INTERESTED]->(otherInterests:Event)
						OPTIONAL MATCH (otherInterestsCalendars: Calendar)-[:HOSTING]->(otherInterests)
						OPTIONAL MATCH (:FBUser)-[totalInterest:INTERESTED]->(otherInterests)
						WHERE ID(myInterests) <> ID(otherInterests) AND otherInterests.date >= timestamp()/1000
						WITH COUNT(totalInterest) as totalInterest, otherInterests, otherInterestsCalendars ORDER BY totalInterest LIMIT 10
						WITH totalInterest, otherInterests, otherInterestsCalendars ORDER BY otherInterests.date
						WITH {event: otherInterests, calendar: otherInterestsCalendars, totalInterestLevel: totalInterest, isUserInterested: false} as res
						RETURN collect(res)
					`;
		var params = {firebaseId: this.authData.getFirebaseId()};
		return this.neo.runQuery(recQuery, params).then((recResults) => {
			let recData: Object[] = recResults[0];
			let reccomendedEvents = recData.map(this.parseEventData);

			var intQuery = `
						MATCH (me: FBUser {firebaseId: "NgUok9Os9POoYYrtT83BP5fwof03"})
						MATCH (me)-[:INTERESTED]->(e:Event)
						MATCH (c: Calendar)-[:HOSTING]->(e)
						OPTIONAL MATCH (:FBUser)-[totalInterest:INTERESTED]->(e)
						WITH COUNT(totalInterest) as totalInterest, e as event, c as calendar ORDER BY event.date
						WITH {event: event, calendar: calendar, totalInterestLevel: totalInterest, isUserInterested: true} as res
						RETURN collect(res)
					`;

			return this.neo.runQuery(intQuery, params).then((intResults) => {
				let intData: Object[] = intResults[0];
				let interestedEvents = intData.map(this.parseEventData);

				return this.combineInterestAndReccomendations(interestedEvents, reccomendedEvents);
			});
		});
	}

	combineInterestAndReccomendations(interestedEvents, reccomendedEvents) {
		interestedEvents.forEach((e) => {
			e.reccomended = false;
		});

		reccomendedEvents.forEach((e) => {
			e.reccomended = true;
		});

		let combined = interestedEvents.concat(reccomendedEvents);
		combined.sort((lhs, rhs) => {
			return lhs.date - rhs.date;
		});

		return combined;
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
						CREATE (u)-[r:SUBSCRIBED]->(c)
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
						CREATE (u)-[r:INTERESTED]->(e)
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
