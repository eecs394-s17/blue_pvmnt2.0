import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';
import { SubscriptionType } from '../../models/subscriptiontype';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [EventService, UserService]
})

export class ListPage {
  items: Array<SubscriptionType>;//all the calendars
  subscribed: Array<SubscriptionType>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, private userService: UserService) {
    this.load();
  }

  load() {

    this.userService.fetchCalendars().then((calendars) => {
      this.items = calendars
     })

     this.userService.getUserSubscriptions(1).then((subscriptions)=>{
       this.subscribed=subscriptions

     })

  }

  subscribe(item){
    console.log("Change subscribe! "+item.calendartype);
    
    // console.log(this.isToggled);
  }
}


    // Fetches all calendars (to produce a list to subscribe to)
    // this.eventService.fetchCalendars().then((calendars) => {
    //   console.log(calendars);
    //   calendars.forEach((calendar) => {
    //     if(this.subscribed.has(calendar)){
    //       this.items.push({
    //         title: calendar,
    //         icon: 'checkbox'
    //       });
    //     }
    //     else{
    //       this.items.push({
    //         title: calendar,
    //         icon: 'checkbox-outline'
    //       });
    //     }
    //   });
    // });

  // itemTapped(event, item) {
  //   this.navCtrl.push(ItemDetailsPage, {
  //     item: item
  //   });
  // }
