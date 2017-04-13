import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details'
import { AuthData } from '../../providers/auth-data';
import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';
import { LoginPage } from '../login/login';

import { Event } from '../../models/event';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [EventService, UserService]
})

export class HelloIonicPage {
  events: Array<Event>;
  loadedevents: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, private userService: UserService, public authData: AuthData) {
    this.load();
    //console.log(this.userService.getUserSubscriptions(1));
  }

  ionViewDidEnter(){
    this.load();
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
      this.loadedevents = events;
    });
  }

  itemTapped(event, item) {

    let view = this.navCtrl.getActive().component.name;
  	this.navCtrl.push(ItemDetailsPage, {
  		item: item, view: view });
  }

  initializeItems(): void {
    this.events = this.loadedevents;
  }

  getItems(searchbar){
 
    this.initializeItems();

    var q = searchbar.srcElement.value;

    if (!q) {
      return;
    }

    this.events = this.events.filter((v) => {
      if(v.name && q || v.calendartype && q || v.host && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        else if (v.calendartype.toLowerCase().indexOf(q.toLowerCase()) > -1){
          return true;
        }
        else if (v.calendartype.toLowerCase().indexOf(q.toLowerCase()) > -1){
          return true;
        }
        return false;
      } 
    });

  }

  logOut(event){
    this.authData.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }

}
