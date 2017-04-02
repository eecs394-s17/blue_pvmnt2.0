import { Event } from '../models/event';

var mock1 = new Event();
mock1.name = 'APAHM 2k17: CelebrAsia';
mock1.desc = 'Join Asian Cultural Organization (ACO) for our final APAHM event, CelebrAsia! This event will feature various performances, demonstrations and presentations that reflect both the modern and traditional aspects of Asian and Asian American culture. It will also feature a fashion show representing different traditional cultural wear.';
mock1.date = 1490995813;
mock1.calendar = 'Asian Cultural Organization';
mock1.tags = ['Entertainment', ' Student Group'];
mock1.place = 'McCormick Auditorium'

var mock2 = new Event();
mock2.name = 'Apply to Sherman Ave Spring 2017!';
mock2.desc = 'It\'s that time of year to do something meaningful with your life. APPLY TO SHERMAN AVE you silly geese. We want new writers. We want you. So bad.';
mock2.date =  1490995970;
mock2.calendar =  'Sherman Ave';
mock2.tags = ['Newspaper', ' Student Group ', ' Comedy'];
mock2.place = 'Email shermanave@northwestern.edu'

export const MOCK_EVENTS: Event[] = [mock1, mock2];