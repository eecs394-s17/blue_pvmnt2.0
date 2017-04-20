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
		e.desc = data.desc;
		e.date = data.date;
		e.img = data.img;
		e.host = data.host;
		e.calendartype = 'Calendar Type';
		e.place = data.location;
		return e;
	}
}
