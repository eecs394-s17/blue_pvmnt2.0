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
	createCalendar(name) {
		var query = 'CREATE (c: Calendar {name: {calendarName}}) \
					 RETURN c';
		var params = {calendarName: name};

		db.query(query, params, (err, results) => {
	  		if (err) {
	      		console.error(err);
	  		} else {
	      		console.log(results);
	  		}
		});
	}

	fetchCalendar(name) {
		var query = 'MATCH (c: Calendar) \
					 WHERE c.name = {calendarName} \
					 RETURN c';
		var params = {calendarName: name};
		
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
		});
	}

	createEventForCalendar(calendar, event) {
		var query = 'MATCH (c: Calendar) 			\
					 WHERE c.name = {calendarName} 	\
					 CREATE (e:Event {eventData}) 	\
					 CREATE (c)-[r:HOSTING]->(e)	\
					 RETURN e';
		var params = {calendarName: calendar, eventData: event};

		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
		});
	}

	fetchUpcomingEventsForCalendar(calendar) {
		var query = '	MATCH (c:Calendar) 										\
					 	WHERE c.name = {calendarName}							\
						MATCH (e:Event)											\
						WHERE (c)-[:HOSTING]->(e) AND e.date >= {currentDate}	\
						SET e.host = c.name 									\
						RETURN e 												\
					';
		var params = {calendarName: calendar, currentDate: (+ new Date())/1000};
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
		});
	}

	createUser(user) {
		var query = 'CREATE (u: User {id: {userId}}) \
					 RETURN u';
		var params = {userId: user};
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
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
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
		});
	}

	unsubscribeUserFromCalendar(user, calendar) {
		var query = '	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar {name: {calendarName}}) 	\
						DELETE r																			\
					';
		var params = {calendarName: calendar, userId: user};
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
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
		db.query(query, params, (err, results) => {
			if (err) {
				console.error(err);
			} else {
				console.log(results);
			}
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
		return new Promise((resolve, reject) => {
			db.query(query, params, (err, results) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(results.map(this.parseEventData));
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
