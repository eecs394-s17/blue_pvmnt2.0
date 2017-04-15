import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user-service';
import { Event } from '../../models/event'
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';
import * as firebase from "firebase";

@Component({
  selector: 'page-filterdate',
  templateUrl: 'filterdate.html',
  providers: [UserService]
})

export class FilterDatePage {
  startdate: any;
  enddate: any;
  callback: any;
  date_array: any;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private userService: UserService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.startdate = new Date().toISOString();
    this.enddate = new Date().toISOString();
    //
  }

  exitPage(event){
    this.date_array = [Math.round(new Date(this.startdate).getTime()/1000), Math.round(new Date(this.enddate).getTime()/1000)];     
    this.callback(this.date_array).then(()=>{
       this.navCtrl.pop();
    });
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback")
    // console.log(this.callback)
  }

}
