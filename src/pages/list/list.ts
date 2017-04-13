import { Component, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';
import { SubscriptionType } from '../../models/subscriptiontype';
import * as firebase from "firebase";

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

  ionViewDidEnter(){
    this.load();
  }
  
  load() {

    var user = firebase.auth().currentUser;
    var uid = user.uid;
    this.userService.fetchCalendars(uid).then((calendars) => {
      this.items = calendars
     })

     this.userService.getUserSubscriptions(uid).then((subscriptions)=>{
       this.subscribed=subscriptions

     })

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
