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

	fetchUpcomingEventsForCalendar(calendar) {
		var query = `	MATCH (c:Calendar) 										
					 	WHERE c.name = {calendarName}							
						MATCH (e:Event)											
						WHERE (c)-[:HOSTING]->(e) AND e.date >= timestamp()/1000	
						SET e.host = c.name 	
						SET e.calendarId = c.id								
						RETURN e 												
					`;
		var params = {calendarName: calendar};
		return this.neo.runQuery(query, params).then((results: Event[]) => {
			return results.map(this.parseEventData);
		});	
	}


	userIsInterestedIn(eventId){
        var query =`	MATCH (u:FBUser {firebaseId: {userId}})-[:INTERESTED]->(e:Event {id: {eventId}})
                        RETURN e
                    `;
        var params = {userId: this.authData.getFirebaseId(), eventId: eventId};
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
    	var query = `  MATCH (u:FBUser {firebaseId: {userId}})-[r:SUBSCRIBED]->(c:Calendar)   
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

	markCurrentUserInterestedInEvent(eventId) {
		var query =	`
						CREATE (u: FBUser {firebaseId: {userId}})-[:INTERESTED]->(e: Event {id: {eventId}}))
						RETURN e
                    `;
        var params = {userId: this.authData.getFirebaseId(), eventId: eventId}
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
		//console.log(data);
		return e;
	}
}
