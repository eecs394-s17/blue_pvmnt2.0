import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details'


import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';

import { Event } from '../../models/event';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [EventService, UserService]
})

export class HelloIonicPage {
  events: Array<Event>;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, private userService: UserService) {
    this.load();
    //console.log(this.userService.getUserSubscriptions(1));
  }

  load() {
    // localStorage.setItem("id", "hello");
    // console.log(localStorage.getItem("id"));
    // Fetches all calendars (to produce a list to subscribe to)
    this.eventService.fetchCalendars().then((calendars) => {
      // console.log(calendars);
    });

    // Fetches all events that the user is currently subscribed to
    this.eventService.fetchEvents().then((events) => {
      this.events = events;
    });
  }

  itemTapped(event, item) {

    let view = this.navCtrl.getActive().component.name;
  	this.navCtrl.push(ItemDetailsPage, {
  		item: item, view: view });
  }

}
