import { NEO4J_CONFIG } from "../../APP_SECRETS";

import seraph from 'seraph'
var db = seraph({
  server: NEO4J_CONFIG.url,
  user: NEO4J_CONFIG.username,
  pass: NEO4J_CONFIG.password
});

export class NeoService {
	runQuery(query, params) {
		return new Promise((resolve, reject) => {
			db.query(query, params, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});	
	}
}