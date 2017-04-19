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
    var start = new Date().toISOString();
    var end = new Date().toISOString();
    this.load(start, end);
  }

  load(start, end){
    this.startdate = start;
    this.enddate = end;
  }


  getTomorrowDates(event){
    var start_date = new Date();
    start_date.setDate(start_date.getDate());
    var str_start = start_date.toISOString();

    var end_date = new Date();
    end_date.setDate(end_date.getDate() + 1)
    var str_end = end_date.toISOString();

    this.load(str_start, str_end);
  }

  getWeekDates(event){
    var start_date = new Date();
    start_date.setDate(start_date.getDate())    
    var str_start = start_date.toISOString();

    var end_date = new Date();
    end_date.setDate(end_date.getDate() + 7)
    var str_end = end_date.toISOString()

    this.load(str_start, str_end);
  }



  exitPage(event){
    this.date_array = [Math.round(new Date(this.startdate).getTime()/1000), Math.round(new Date(this.enddate).getTime()/1000)];     
    this.callback(this.date_array).then(()=>{
       this.navCtrl.pop();
    });
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback")
  }

}
