import { Component, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';
import { SubscriptionType } from '../../models/subscriptiontype';
import { CalendarService } from '../../services/calendar-service';

import * as firebase from "firebase";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [EventService, UserService, CalendarService]
})

export class ListPage {
  items: Array<SubscriptionType>;//all the calendars
  subscribed: Array<SubscriptionType>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cd: ChangeDetectorRef, private eventService: EventService, private userService: UserService, private calendarService: CalendarService) {
    this.load();
  }

  ionViewDidEnter(){
    this.load();
  }
  
  load() {

    var user = firebase.auth().currentUser;
    var uid = user.uid;

    this.calendarService.fetchallCalendars().then((calendars) => {
      console.log(calendars);
      this.items = calendars;
    })

    // this.userService.fetchCalendars(uid).then((calendars) => {
    //   console.log(calendars);
    //   this.items = calendars
    //  })

    //  this.userService.getUserSubscriptions(uid).then((subscriptions)=>{
    //    this.subscribed = subscriptions

    //  })

  }

  subscribe(item){

    var user = firebase.auth().currentUser;
    var uid = user.uid;
    if(item.icon=='checkmark'){
      console.log("unsubscribe "+ item.calendartype);
      this.userService.removeUserSubscriptions(uid,item.calendartype);
      item.icon='close-circle';
    }
    else{
      console.log("subscribe "+item.calendartype);
      this.userService.updateUserSubscriptions(uid,item.calendartype);
      item.icon='checkmark';
    }
  }


}
