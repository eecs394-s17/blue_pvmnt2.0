import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';

import { Event } from '../../models/event';

import { ItemDetailsPage } from '../item-details/item-details';
import * as firebase from "firebase";

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
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    this.userService.fetchEventsPersonal(uid).then((events) => {
      this.events = events;
    });
  }

  itemTapped(event, item) {
    let view = this.navCtrl.getActive().component.name;
  	this.navCtrl.push(ItemDetailsPage, {
  		item: item, view: view });
	}



}
