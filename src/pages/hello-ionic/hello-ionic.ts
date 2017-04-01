import { Component } from '@angular/core';

import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [EventService]
})

export class HelloIonicPage {
  events: Array<Event>;

  constructor(private eventService: EventService) {
    this.events = this.eventService.fetch();
  }

}
