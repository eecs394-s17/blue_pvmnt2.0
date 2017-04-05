import { Component } from '@angular/core';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details'

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [EventService]
})

export class HelloIonicPage {
  events: Array<Event>;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {
    this.load();  
  }

  load() {
  	this.eventService.fetch().then((events) => {
    	this.events = events;
    	console.log(events)
	  });
    

    // Fetches all calendars (to produce a list to subscribe to)
    this.eventService.fetchCalendars().then((calendars) => {
      console.log(calendars);
    });

    // Fetches all events that the user is currently subscribed to
    this.eventService.fetchEvents().then((events) => {
      console.log(events);
    });    
  }

  itemTapped(event, item) {
    
  	this.navCtrl.push(ItemDetailsPage, { 
  		item: item });
  }

}
