import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'
import { Event } from '../../models/event'
import { EventService } from '../../services/event-service';
import * as firebase from "firebase";
import * as moment from 'moment';


@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html',
  providers: [EventService]
})

export class EventCard {
  @Input() event: Event;
  day: string;
  month: string;
  time: string;
  selectedItem: any;


   constructor(private eventService: EventService, public navParams: NavParams){
  //   var t = moment.unix(this.event.date);
  //   this.day = t.format("DD");
  //   this.month = t.format("MM");
  //   this.time = t.format("h:mm a");
  this.selectedItem = navParams.get('item');
   }

  getDay() {
    return moment.unix(this.event.date).format("DD");
  }
  getMonth() {
    return moment.unix(this.event.date).format("MMM");
  }
  getTime(){
    return moment.unix(this.event.date).format("h:mm a");
  }

  logEvent(event) {
    event.stopPropagation();
    console.log('hello');
    
  }

  interestedIn(event){
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    this.eventService.interestedUserToEvent(1, this.event.id);
    console.log(uid);
    console.log(this.event.id);
    console.log('hello');
  }

}
