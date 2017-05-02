import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CalendarService } from '../../services/calendar-service';
import { Event } from '../../models/event'
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';
import * as firebase from "firebase";

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
  providers: [CalendarService]
})

export class ItemDetailsPage {
  selectedItem: any;
  day: string;
  month: string;
  time: string;
  priorView: string;
  isSubscribed: Boolean;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public navParams: NavParams, private calendarService: CalendarService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.priorView = navParams.get('view');
    // this.displaybuttonname();
    // console.log(this.selectedItem.calendarId);
    // if(this.calendarService.isUserSubscribed(this.selectedItem.calendarId)){
    //   console.log('asdf');
    // }
    this.calendarService.isUserSubscribed(this.selectedItem.calendarId).then((bool: Boolean) => {
      this.isSubscribed = bool;
    });

  }

  getDay() {
    return moment.unix(this.selectedItem.date).format("DD");
  }
  getMonth() {
    return moment.unix(this.selectedItem.date).format("MMM");
  }
  getTime(){
    return moment.unix(this.selectedItem.date).format("h:mm a");
  }


  addtoCalendar(event) {
    this.isSubscribed = true;
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    if((this.selectedItem.host).toLowerCase() == 'northwestern' && this.priorView == 'PersonalPage'){
      let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'You cannot unsubscribe Northwestern events since you are a student in Northwestern.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    //console.log(uid);
    if (this.priorView == 'PersonalPage'){
       this.calendarService.unsubscribeCurrentUserFromCalendar(this.selectedItem.calendarId);
       event.buttonDisabled = true;
    }
    else{
      this.calendarService.subscribeCurrentUserToCalendar(this.selectedItem.calendarId);
    }

  }

  // displaybuttonname(){
  //   var buttontext = '';
  //   var isSubscribed;
  //   this.calendarService.isUserSubscribed(this.selectedItem.calendarId).then((bool: Boolean) => {
  //     isSubscribed = bool;
  //   });
  //   if (isSubscribed){
  //     buttontext = 'Unsubscribe from Similar Events';
  //   }
  //   else {
  //     buttontext = 'Subscribe to Similar Events'
  //   }
  //   return buttontext;
  // }
}
