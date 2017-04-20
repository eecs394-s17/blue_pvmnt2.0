import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Event } from '../models/event';
import { NeoService } from './neo-service';

@Injectable()
export class EventService {
	neo: NeoService;

	constructor() {
		this.neo = new NeoService();
	}

	fetchUpcomingEventsForCalendar(calendar) {
		var query = `	MATCH (c:Calendar) 										
					 	WHERE c.name = {calendarName}							
						MATCH (e:Event)											
						WHERE (c)-[:HOSTING]->(e) AND e.date >= timestamp()/1000	
						SET e.host = c.name 									
						RETURN e 												
					`;
		var params = {calendarName: calendar};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
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

	interestedUserToEvent(user, eventID) {
		var query = '	MATCH (e:Event) 										\
					 	WHERE ID(e) = {eventId}							\
						MATCH (u:FBUser)											\
						WHERE u.firebaseId = {userId}									\
						CREATE (u)-[r:INTERESTED]->(e)							\
						RETURN u 												\
					';
		var params = {eventId: eventID, userId: user};
		console.log(user);
		console.log(eventID);
		console.log(user);
		return this.neo.runQuery(query, params).then((results) => {
			return results;
		});
	}

	userIsInterestedIn(user){
        var query =`MATCH (u:User)-[:INTERESTED]->(e:Event)
                                WHERE u.id = {uid}
                                RETURN e
                                `
        var params = {uid: user}
        return this.neo.runQuery(query, params).then((results) => {
                return results;
        });
    }


	unsubscribeUserFromCalendar(user, calendar) {
		var query = `	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar {name: {calendarName}}) 	
						DELETE r																			
					`;
		var params = {calendarName: calendar, userId: user};
		return this.neo.runQuery(query, params).then((results) => {
			return results;
		});	
	}

	fetchUpcomingEventsForUser(userId) {
		var query = `	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar) 	
						MATCH (c)-[:HOSTING]->(e: Event)													
						WHERE e.date >= timestamp()/1000													
						SET e.host = c.name 																
						RETURN e 																			
						ORDER BY e.date																	
					`;
		var params = {userId: userId};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});	
	}

	fetchAllUpcomingEvents() {
		var query = `	MATCH (c:Calendar)-[:HOSTING]->(e:Event)	
						WHERE e.date >= timestamp()/1000		
						SET e.host = c.name							
						RETURN e 									
						ORDER BY e.date								
					`;
		var params = {};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			console.log(results);
			return results.map(this.parseEventData);
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
		//console.log(data);
		return e;
	}
}
