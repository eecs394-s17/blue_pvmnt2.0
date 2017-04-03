import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "../../APP_SECRETS";
firebase.initializeApp(FIREBASE_CONFIG);	

import { MOCK_EVENTS } from '../mocks/mock-events';
import { Event } from '../models/event';

@Injectable()
export class EventService {
	fetchMock() {
		return MOCK_EVENTS;
	}

	fetch() {
		return firebase.database().ref('/event/').once('value').then((snapshot) => {
  			var eventJSONs = snapshot.val();
  			return eventJSONs.map(this.jsonToEvent);
		});
	}

	jsonToEvent(json) {
		var e = new Event();
		e.name = json.name;
		e.desc = json.desc;
		e.date = json.date;
		e.calendar = json.calendar;
		e.tags = json.tags;
		return e;
	} 
}