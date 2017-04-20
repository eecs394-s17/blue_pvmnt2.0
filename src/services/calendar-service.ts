import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Event } from '../models/event';
import { Calendar } from '../models/calendar';
import { NeoService } from './neo-service';

@Injectable()

export class CalendarService {
	neo: NeoService;

	constructor() {
		this.neo = new NeoService();
	}

	fetchallCalendars(){
		var query = `	MATCH (c:Calendar)
						RETURN c
					`;

		return this.neo.runQuery(query, {}).then((results: Calendar[]) => {
			return results.map(this.parseCalendarData);
		}) ;
	}

	parseCalendarData(data) {
		let c = new Calendar();
		c.name = data.name;
		c.id = data.id;
		return c
	}

}
