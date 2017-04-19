import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";
import { FIREBASE_CONFIG, NEO4J_CONFIG } from "../../APP_SECRETS";
firebase.initializeApp(FIREBASE_CONFIG);

import { Event } from '../models/event';

import seraph from 'seraph'
var db = seraph({
  server: NEO4J_CONFIG.url,
  user: NEO4J_CONFIG.username,
  pass: NEO4J_CONFIG.password
});


@Injectable()
export class EventService {

	// fetch() {
	// 		return firebase.database().ref('/event/').once('value').then((snapshot) => {
	//
  // 				var eventJSONs = snapshot.val();
  // 				return eventJSONs.slice(1).map(this.jsonToEvent);
	// 		});
	// }

	jsonToEvent(json) {
		var e = new Event();
		e.name = json.name;
		e.desc = json.desc;
		e.date = json.date;
		e.img = json.img;
		e.calendartype = json.calendartype;
		e.tags = json.tags;
		e.place = json.place;
		return e;
	}

	//New Stuff
	subscriptions = new Set(['northwestern', 'arts']);

	addSubscription(sub) {
		this.subscriptions.add(sub);
	}

	removeSubscription(sub) {
		if (this.subscriptions.has(sub)) {
			this.subscriptions.delete(sub);
		}
	}

	fetchCalendars() {
		return firebase.database().ref('/calendar/').once('value').then((snapshot) => {
			var calendars = snapshot.val();
			return Object.keys(calendars);
		});
	}

	fetchEvents() {
		return firebase.database().ref('/calendar/').once('value').then((snapshot) => {
			var data = snapshot.val();
			let events = [];

			this.subscriptions.forEach((sub) => {
				// console.log(sub);
				events = events.concat(data[sub].map(this.eventJSONtoEventObj));
			});

			events.sort(function (lhs, rhs) {
				return ~~(lhs.date > rhs.date);
			});

			//console.log(events)
			return events;
		});
	}

	eventJSONtoEventObj(json) {
		var e = new Event();
		e.name = json.name;
		e.desc = json.desc;
		e.date = json.date;
		e.img = json.img;
		e.calendartype = json.calendartype;
		e.host = json.host;
		e.place = json.place;
		return e;
	}

	// Graph Database Shiz
	fetchUpcomingEventsForCalendar(calendar) {
		var query = '	MATCH (c:Calendar) 										\
					 	WHERE c.name = {calendarName}							\
						MATCH (e:Event)											\
						WHERE (c)-[:HOSTING]->(e) AND e.date >= timestamp()/1000	\
						SET e.host = c.name 									\
						RETURN e 												\
					';
		var params = {calendarName: calendar};
		return this.graphQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});	
	}

	createUser(user) {
		var query = 'CREATE (u: User {id: {userId}}) \
					 RETURN u';
		var params = {userId: user};
		return this.graphQuery(query, params).then((results) => {
			return results;
		});
	}

	subscribeUserToCalendar(user, calendar) {
		var query = '	MATCH (c:Calendar) 										\
					 	WHERE c.name = {calendarName}							\
						MATCH (u:User)											\
						WHERE u.id = {userId}									\
						CREATE (u)-[r:SUBSCRIBED]->(c)							\
						RETURN u 												\
					';
		var params = {calendarName: calendar, userId: user};
		return this.graphQuery(query, params).then((results) => {
			return results;
		});
	}

	unsubscribeUserFromCalendar(user, calendar) {
		var query = '	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar {name: {calendarName}}) 	\
						DELETE r																			\
					';
		var params = {calendarName: calendar, userId: user};
		return this.graphQuery(query, params).then((results) => {
			return results;
		});	
	}

	fetchUpcomingEventsForUser(userId) {
		var query = '	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar) 	\
						MATCH (c)-[:HOSTING]->(e: Event)													\
						WHERE e.date >= timestamp()/1000													\
						SET e.host = c.name 																\
						RETURN e 																			\
						ORDER BY e.date																	\
					';
		var params = {userId: userId};
		return this.graphQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});	
	}

	fetchAllUpcomingEvents() {
		var query = '	MATCH (c:Calendar)-[:HOSTING]->(e:Event)	\
						WHERE e.date >= timestamp()/1000		\
						SET e.host = c.name							\
						RETURN e 									\
						ORDER BY e.date								\
					';
		var params = {};
		return this.graphQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});		
	}

	graphQuery(query, params) {
		return new Promise((resolve, reject) => {
			db.query(query, params, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
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
