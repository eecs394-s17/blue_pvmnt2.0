import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event'
import * as moment from 'moment';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})

export class ItemDetailsPage {
  selectedItem: any;
  day: string;
  month: string;
  time: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  getDay() {
    return moment.unix(this.selectedItem.date).format("DD");
  }
  getMonth() {
    return moment.unix(this.selectedItem.date).format("MMMM");
  }
  getTime(){
    return moment.unix(this.selectedItem.date).format("h:mm a");
  }

  // @Input() event: Event;
  // day: string;
  // month: string;
  // time: string;

  // constructor(){
  //   var t = moment.unix(this.event.date);
  //   this.day = t.format("DD");
  //   this.month = t.format("MM");
  //   this.time = t.format("h:mm a");
  // }

  // getDay() {
  //   return moment.unix(this.event.date).format("DD");
  // }
  // getMonth() {
  //   return moment.unix(this.event.date).format("MMM");
  // }
  // getTime(){
  //   return moment.unix(this.event.date).format("h:mm a");
  // }


}
