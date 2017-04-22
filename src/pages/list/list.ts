import { Component, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { HostEventsPage } from '../hostevents/hostevents';

import { EventService } from '../../services/event-service';
import { SubscriptionType } from '../../models/subscriptiontype';
import { CalendarService } from '../../services/calendar-service';
import { Calendar } from '../../models/calendar';

import * as firebase from "firebase";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [EventService, CalendarService]
})

export class ListPage {
  calendars: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cd: ChangeDetectorRef, private eventService: EventService, private calendarService: CalendarService) {
    this.load();
  }

  ionViewDidEnter(){
    this.load();
  }
  
  load() {

    this.calendarService.fetchCurrentUserCalendars().then((cals: Object) => {
      this.calendars = cals;
    });
  }

  getCalendarEvents(event, item){
    console.log(item);
    this.navCtrl.push(HostEventsPage, {
      item: item })
  }

  subscribe(cal){

    if(cal.subscribed == true ){
      this.calendarService.unsubscribeCurrentUserFromCalendar(cal.id);
      console.log(' TRUE cal.name ' + cal.name)
      console.log('TRUE cal.subscribed ' + cal.subscribed)
      console.log('TRUE cal.id ' + cal.id)
    }
    else{
      this.calendarService.subscribeCurrentUserToCalendar(cal.id);
      console.log('FALSE cal.name ' + cal.name)
      console.log('FALSE cal.subscribed ' + cal.subscribed)
      console.log('FALSE cal.id ' + cal.id)
    }
  }




}
