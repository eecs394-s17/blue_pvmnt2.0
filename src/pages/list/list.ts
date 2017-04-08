import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public cd: ChangeDetectorRef, private eventService: EventService, private userService: UserService) {
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

    if(item.icon=='checkmark'){
      console.log("unsubscribe "+ item.calendartype);
      this.userService.removeUserSubscriptions(1,item.calendartype);
    }
    else{
      console.log("subscribe "+item.calendartype);
      this.userService.updateUserSubscriptions(1,item.calendartype);
    }
  }


}

