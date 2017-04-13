import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { PersonalPage } from '../personal/personal';
import { ListPage } from '../list/list';

@Component({
	templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
	tab1Root: any = HelloIonicPage;
 	tab2Root: any = PersonalPage;
 	tab3Root: any = ListPage;
 	mySelectedIndex: number;

  constructor(navParams: NavParams) {
  	this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}