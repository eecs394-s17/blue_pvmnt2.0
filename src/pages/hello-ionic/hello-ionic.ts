import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details'
import { AuthData } from '../../providers/auth-data';
import { EventService } from '../../services/event-service';
import { LoginPage } from '../login/login';
import { FilterDatePage } from '../filterdate/filterdate';

import { Event } from '../../models/event';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [EventService]
})

export class HelloIonicPage {
  events: Array<Event>;
  loadedevents: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  filter_date_array: any;
  start_date: any;
  end_date: any;
  button_press_count: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService,  public authData: AuthData, private _app: App) {
    this.load();
    this.button_press_count = 0;
  }

  myCallbackFunction = (_params) => {
  return new Promise((resolve, reject) => {
     this.filter_date_array = _params;
     this.start_date = this.filter_date_array[0];
     this.end_date = this.filter_date_array[1];
     this.filterDateHelper();
     resolve();
  })
  }

  filterDates(event){
    if ((this.button_press_count % 2) == 0){
      this.navCtrl.push(FilterDatePage, {
        callback: this.myCallbackFunction
      });
    }
    else{
      this.initializeItems();
    }
    this.button_press_count = this.button_press_count + 1;
  }

  filterDateHelper(){

    this.initializeItems();

    var dates = new Array();
    var start = this.start_date;
    var end = this.end_date;

    this.events = this.events.filter((v) => {
      if(start <= v.date && end >= v.date) {
        return true;
      }
      else{
        return false;
      }
    });

  }

  displaybuttonname(){
    var buttontext = '';
    if ((this.button_press_count % 2) == 0){
      buttontext = 'Filter by Date';
    }
    else{
      buttontext = 'Remove Filter'
    }
    return buttontext;
  }

  // ionViewDidEnter(){
  //   this.initializeItems();
  // }

  load() {

    // this.eventService.fetchCalendars().then((calendars) => {
    //   // console.log(calendars);
    // });

     this.eventService.fetchAllUpcomingEvents().then((events: Event[]) => {
         this.events = events;
         this.loadedevents = events;
      });

    // Fetches all events that the user is currently subscribed to
    // this.eventService.fetchEvents().then((events) => {
    //   this.events = events;
    //   this.loadedevents = events;
    // });
  }

  ionViewDidEnter(){
    if ((this.button_press_count % 2) == 0){
      this.load();
    }
    else{
      console.log('Do Nothing');
    }
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
        else if (v.host.toLowerCase().indexOf(q.toLowerCase()) > -1){
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
    this._app.getRootNav().setRoot(LoginPage);
  }

}
