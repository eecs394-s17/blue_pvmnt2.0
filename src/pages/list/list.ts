import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { EventService } from '../../services/event-service';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [EventService]
})
export class ListPage {
  items: Array<{title: string, icon: string}>
  subscribed = new Set(['arts'])

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {
    
    // Fetches all calendars (to produce a list to subscribe to)
    this.eventService.fetchCalendars().then((calendars) => {
      console.log(calendars);
      calendars.forEach((calendar) => {
        if(this.subscribed.has(calendar)){
          this.items.push({
            title: calendar,
            icon: 'checkbox'
          });
        }
        else{
          this.items.push({
            title: calendar,
            icon: 'checkbox-outline'
          });
        }
      });
    });

  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
