import { Component, Input } from '@angular/core';
import { Event } from '../../models/event'


@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html'
})

export class EventCard {
  @Input() event: Event;
}
