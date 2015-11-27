/// <reference path="../typings/node/node.d.ts"/>


import http = require('http');

import Request from './Request';
import RouteHandler from './RouteHandler';
import Url from './Url';
import Response from './Response';

/**
 * @class
 */
class App {
	private server:http.Server;
	private routes:Array<RouteHandler> = new Array<RouteHandler>();
	constructor() {
		this.server = http.createServer(this.serverHandler.bind(this));
	}
	
	private serverHandler(req:http.IncomingMessage,res:http.ServerResponse) {
		let buffer = '';
		let self = this;
		req.on('data', chunk => buffer += chunk);
		req.on('end', () => {
			let u = req.url;
			for (let route of self.routes) {
				if (Url.match(u,route.getPath())) {
					let url = Url.parse(u,route.getPath());
					let request = new Request(req, url, buffer);
					let response = new Response(res);
					route.handle(request, response)
						.then(() => {
							response.flush();
						})
						.catch(err => {
							console.error(err.message);
							console.error(err.stack);
						})
				}
			}
		});
		
	}
	
	public listen(port:number,hostname?:string) {
		this.server.listen(port,hostname);	
	}
	
	public register(route:RouteHandler) {
		this.routes.push(route);
	}
}

export default App;