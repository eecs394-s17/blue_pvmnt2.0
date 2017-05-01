import { Component, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, App } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { HostEventsPage } from '../hostevents/hostevents';

import { EventService } from '../../services/event-service';
import { SubscriptionType } from '../../models/subscriptiontype';
import { CalendarService } from '../../services/calendar-service';
import { Calendar } from '../../models/calendar';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import * as firebase from "firebase";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [EventService, CalendarService, UserService]
})

export class ListPage {
  calendars: Object;
  user: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cd: ChangeDetectorRef, private eventService: EventService, private calendarService: CalendarService, private userService: UserService, public authData: AuthData, public _app: App) {
    this.load();
  }

  ionViewDidEnter(){
    this.load();
  }
  
  load() {

    this.calendarService.fetchCurrentUserCalendars().then((cals: Object) => {
      this.calendars = cals;
    });

    this.userService.fetchUserData().then((user_temp: Object) => {
      this.user = user_temp;
      console.log(this.user);
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

  logOut(event){
    this.authData.logoutUser();
    this._app.getRootNav().setRoot(LoginPage);
  }





}
