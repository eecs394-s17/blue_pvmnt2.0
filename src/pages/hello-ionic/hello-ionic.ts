import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(public alerCtrl: AlertController) {  
  }

    doAlert() {
    let alert = this.alerCtrl.create({
      title: 'Event Reminder!',
      message: 'Dance Marathon starts in 5 min!',
      buttons: ['Ok']
    });
    alert.present()
  }
}
