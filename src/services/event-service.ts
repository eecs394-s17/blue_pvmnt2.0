import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "../../APP_SECRETS";
firebase.initializeApp(FIREBASE_CONFIG);

import { MOCK_EVENTS } from '../mocks/mock-events';
import { Event } from '../models/event';

var MOCKING = false;

@Injectable()
export class EventService {
	fetchMock() {
		return MOCK_EVENTS;
	}

	fetch() {
		if (MOCKING) {
			return new Promise((resolve, reject) => {
				resolve(MOCK_EVENTS);
			});
		} else {
			return firebase.database().ref('/event/').once('value').then((snapshot) => {
  				var eventJSONs = snapshot.val();
  				return eventJSONs.slice(1).map(this.jsonToEvent);
			});
		}
	}

	jsonToEvent(json) {
		var e = new Event();
		e.name = json.name;
		e.desc = json.desc;
		e.date = json.date;
		e.img = json.img;
		e.calendar = json.calendar;
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
				events = events.concat(data[sub].map(this.eventJSONtoEventObj));
			});

			events.sort(function (lhs, rhs) {
				return ~~(lhs.date > rhs.date);
			});

			return events;
		});
	}

	eventJSONtoEventObj(json) {
		var e = new Event();
		e.name = json.name;
		e.desc = json.desc;
		e.date = json.date;
		e.img = json.img;
		e.host = json.host;
		e.place = json.place;
		return e;
	}
}
