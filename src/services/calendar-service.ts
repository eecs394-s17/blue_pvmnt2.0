import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Event } from '../models/event';
import { NeoService } from './neo-service';

@Injectable()

export class CalendarService {
	neo: NeoService;

	constructor() {
		this.neo = new NeoService();
	}

	fetchallCalendars(){
		var query = `	MATCH (c:Calendar)
						RETURN c.name
					`;

		return this.neo.runQuery(query, {});
	}

}
