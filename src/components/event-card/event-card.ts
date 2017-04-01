import { Component, Input } from '@angular/core';
import { Event } from '../../models/event'

import * as moment from 'moment';


@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html'
})

export class EventCard {
  @Input() event: Event;
  day: string;
  month: string;
  time: string;

  // constructor(){
  //   var t = moment.unix(this.event.date);
  //   this.day = t.format("DD");
  //   this.month = t.format("MM");
  //   this.time = t.format("h:mm a");
  // }


  getDay() {
    return moment.unix(this.event.date).format("DD");
  }
  getMonth() {
    return moment.unix(this.event.date).format("MMM");
  }
  getTime(){
    return moment.unix(this.event.date).format("h:mm a");
  }
}
