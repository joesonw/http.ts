/// <reference path="../typings/node/node.d.ts"/>
import http = require('http');


import Request from './entity/Request';
import RouteHandler from './entity/RouteHandler';
import Url from './entity/Url';
import Response from './entity/Response';

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
		
		let u = req.url;
		req.on('data', chunk => buffer += chunk);
		req.on('end', () => {
			let response = new Response(res);
			let found = false;
			for (let route of self.routes) {
				if (Url.match(u,route.getPath() + '/*')) {
					let url = Url.parse(u,route.getPath());
					let request = new Request(req, url, buffer);
					let response = new Response(res);
					
					route.handle(req, response, buffer)
						.then(() => {
							response.flush();
						})
						.catch(err => {
							console.error(err.message);
							console.error(err.stack);
						})
					found = true;
				} else if (Url.match(u,route.getPath())) {
					let url = Url.parse(u,route.getPath());
					let request = new Request(req, url, buffer);
					let response = new Response(res);
					
					route.handle(req, response, buffer)
						.then(() => {
							response.flush();
						})
						.catch(err => {
							console.error(err.message);
							console.error(err.stack);
						})
					found = true;
				}
			}
			if (!found) {
				response.write('not found on app');
				response.flush();
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