import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';

import { Event } from '../../models/event';

import { ItemDetailsPage } from '../item-details/item-details'

@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html',
  providers: [EventService, UserService]
})
export class PersonalPage {
  events: Array<Event>;
  subscriptions: string[];
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, private userService: UserService) {
    this.load();
  }

  load() {
    this.userService.getUserSubscriptions(1).then( (subs) => {
      console.log(subs);
      this.subscriptions = subs;
    });
  	// this.eventService.fetchEvents().then((events) => {
    // 	this.events = events;
    // 	console.log(events)
	  //  });
  }

  itemTapped(event, item) {

  	this.navCtrl.push(ItemDetailsPage, {
  		item: item });


	}

}
