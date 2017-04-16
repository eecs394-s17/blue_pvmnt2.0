
const NEO4J_CONFIG = {
	bolt: "bolt://hobby-kabmebgfojekgbkecoipifol.dbs.graphenedb.com:24786",
	url: "http://hobby-kabmebgfojekgbkecoipifol.dbs.graphenedb.com:24789/db/data/",
	username: "dev",
	password: "b.ytNHQzmBCc2t.n7O0NWFqDAannoq2",
};


var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(NEO4J_CONFIG.bolt, neo4j.auth.basic(NEO4J_CONFIG.username, NEO4J_CONFIG.password));

function createCalendar(name) {
	var session = driver.session();
	var query = 'CREATE (c: Calendar {name: {calendarName}}) \
				 RETURN c';
	var params = {calendarName: name};

	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record);
	    	});
	        

	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function fetchCalendar(name) {
	var session = driver.session();
	var query = 'MATCH (c: Calendar) \
				 WHERE c.name = {calendarName} \
				 RETURN c';
	var params = {calendarName: name};
	
	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record);
	    	});
	        

	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function createEventForCalendar(calendar, event) {
	var session = driver.session();
	var query = 'MATCH (c: Calendar) 			\
				 WHERE c.name = {calendarName} 	\
				 CREATE (e:Event {eventData}) 	\
				 CREATE (c)-[r:HOSTING]->(e)	\
				 RETURN e';
	var params = {calendarName: calendar, eventData: event};

	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record);
	    	});
	        

	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function fetchUpcomingEventsForCalendar(calendar) {
	var session = driver.session();
	var query = '	MATCH (c:Calendar) 										\
				 	WHERE c.name = {calendarName}							\
					MATCH (e:Event)											\
					WHERE (c)-[:HOSTING]->(e) AND e.date >= {currentDate}	\
					SET e.host = c.name 									\
					RETURN e 												\
				';
	var params = {calendarName: calendar, currentDate: (+ new Date())/1000};
	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record.toObject());
	    	});
	        
	    	// console.log(result);
	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function createUser(user) {
	var session = driver.session();
	var query = 'CREATE (u: User {id: {userId}}) \
				 RETURN u';
	var params = {userId: user};

	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record);
	    	});
	        

	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function subscribeUserToCalendar(user, calendar) {
	var session = driver.session();
	var query = '	MATCH (c:Calendar) 										\
				 	WHERE c.name = {calendarName}							\
					MATCH (u:User)											\
					WHERE u.id = {userId}									\
					CREATE (u)-[r:SUBSCRIBED]->(c)							\
					RETURN u 												\
				';
	var params = {calendarName: calendar, userId: user};
	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record.toObject());
	    	});
	        
	    	// console.log(result);
	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function unsubscribeUserFromCalendar(user, calendar) {
	var session = driver.session();
	var query = '	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar {name: {calendarName}}) 	\
					DELETE r																			\
				';
	var params = {calendarName: calendar, userId: user};
	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record.toObject());
	    	});
	        
	    	// console.log(result);
	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

function fetchUpcomingEventsForUser(userId) {
	var session = driver.session();
	var query = '	MATCH (u:User {id: {userId}})-[r:SUBSCRIBED]->(c:Calendar) 	\
					MATCH (c)-[:HOSTING]->(e: Event)													\
					WHERE e.date >= timestamp()/1000													\
					SET e.host = c.name 																\
					RETURN e 																			\
					ORDER BY e.date																	\
				';
	var params = {userId: userId};
	session
	    .run(query, params)
	    .then((result) => {
	    	result.records.forEach(record => {
	    		console.log(record.toObject());
	    	});
	        
	    	// console.log(result);
	        session.close();
	    })
	    .catch((error) => {
	        console.log(error);
	    });	
}

export function fetchAllUpcomingEvents() {
		var session = driver.session();
		var query = '	MATCH (c:Calendar)-[:HOSTING]->(e:Event)	\
						WHERE WHERE e.date >= timestamp()/1000		\
						SET e.host = c.name							\
						RETURN e 									\									\
						ORDER BY e.date								\
					';
		var params = {};
		session
		    .run(query, params)
		    .then((result) => {
		    	result.records.forEach(record => {
		    		console.log(record.toObject());
		    	});
		        
		    	// console.log(result);
		        session.close();
		    })
		    .catch((error) => {
		        console.log(error);
		    });	
	}
var c1 = 'Sit & Spin Productions';
var e1 = {
	name:'Sit&Spin Stand Up 11: Sleepover!',
	desc: 'You\'re cordially invited to SIT&SPIN\'S STAND UP 11: SLEEPOVER! $5 gets you into the funniest slumber party with lots of truth and maybe a few dares ! WHO: Devon Kerr! Emma Horn! Graque Dowling! Izzy Gerasole!  Jess Zeidman! Malloy Moseley! Nabeel Muscatwalla! Nick Tiffany!',
	date: 1591699600,
	img: 'https://scontent-ord1-1.xx.fbcdn.net/v/t31.0-0/p600x600/17505138_10212555440146288_1887239544389086062_o.jpg?oh=6f37dc63b8d6a936f55c5f2a1bf2508a&oe=5994FE24',
	location: 'Harris Hall',
};

var e2 = {
	name:'Steam Heat and the City',
	desc: 'Come celebrate love, friendship, fashion, and more at Steam Heat and the City! Steam Heat Dance Company\'s 8th annual show will include numbers from musical theater favorites like Newsies, 42nd Street, and Cabaret, as well as a LIVE BAND!!',
	date: 1591526800,
	img: 'https://scontent-ord1-1.xx.fbcdn.net/v/t1.0-9/17553927_1614108898616493_8411125007505576047_n.jpg?oh=10ffd2fdedb41a725fb1a945716ffada&oe=5958E1B9',
	location: 'Virginia Wadsworth Wirtz Center for the Performing Arts',
}

var c2 = 'Sherman Ave';
var e3 = {
	name: 'Apply to Sherman Ave Spring 2017!',
	desc: 'It\'s that time of year to do something meaningful with your life. APPLY TO SHERMAN AVE you silly geese. We want new writers. We want you. So bad.',
	date: 1590995970,
	location: 'Online',
	img: 'https://scontent-ort2-1.xx.fbcdn.net/v/t31.0-8/17311391_1364814600241290_9118070343019354451_o.jpg?oh=388fa7555206e57b9ef1addea9d30536&oe=5954BE6E',
}

var u1 = 1;

// createCalendar(c1);
// createEventForCalendar(c1, e1);
// fetchUpcomingEventsForCalendar(c1);
// createUser(u1);
// subscribeUserToCalendar(u1, c1);
// unsubscribeUserFromCalendar(u1, c1);
// fetchUpcomingEventsForUser(u1);
// createEventForCalendar(c1, e2);
// createCalendar(c2);
// createEventForCalendar(c2, e3);
// subscribeUserToCalendar(u1, c2);
// unsubscribeUserFromCalendar(u1, c1);
// fetchUpcomingEventsForUser(u1);
// fetchAllUpcomingEvents();