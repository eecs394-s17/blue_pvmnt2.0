import { Component } from '@angular/core';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { PersonalPage } from '../personal/personal';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HelloIonicPage;
  tab2Root: any = PersonalPage;
  // tab3Root: any = ContactPage;

  constructor() {

  }
}