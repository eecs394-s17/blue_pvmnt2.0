export class Event {
	name: string;
	id: number;
	desc: string;
	date: number;
	calendartype: string;
	calendarId: number;
	img: string;
	tags: string[];
	place: string;    //location
	host: string;     // who is hosting the event
	summary: string;
	userIsInterested: boolean;
}
