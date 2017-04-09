import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user-service';
import { Event } from '../../models/event'
import * as moment from 'moment';
import * as firebase from "firebase";

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
  providers: [UserService]
})

export class ItemDetailsPage {
  selectedItem: any;
  day: string;
  month: string;
  time: string;
  priorView: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.priorView = navParams.get('view');
    this.displaybuttonname();
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


  addtoCalendar(event) {
    // assuming post event to firebase
    // console.log(JSON.stringify(this.selectedItem.calendartype));
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    console.log(uid);
    if (this.priorView == 'PersonalPage'){
       this.userService.removeUserSubscriptions(uid, this.selectedItem.calendartype);
       event.buttonDisabled = true;
    }
    else{
      this.userService.updateUserSubscriptions(uid, this.selectedItem.calendartype);
      console.log('hello');
    }
    
  }

  displaybuttonname(){
    var buttontext = '';
    if (this.priorView == 'PersonalPage'){
      buttontext = 'Unsubscribe from Similar Events';
    }
    else {
      buttontext = 'Subscribe to Similar Events'
    }
    return buttontext;
  }
}
