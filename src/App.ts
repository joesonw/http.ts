/// <reference path="../typings/node/node.d.ts"/>
import http = require('http');


import Request from './entity/Request';
import RouteHandler from './entity/RouteHandler';
import Url from './entity/Url';
import Response from './entity/Response';
import Exception from './exception/Exception';
import HttpStatus from './util/HttpStatus';
import NotFoundException from './exception/NotFoundException';

/**
 * @class
 */
class App {
	private server:http.Server;
	private routes:Array<RouteHandler> = new Array<RouteHandler>();
	private exceptionHandler:(exception:Exception, response:Response) => void;
	
	constructor() {
		this.server = http.createServer(this.serverHandler.bind(this));
		this.exceptionHandler = this.defaultExceptionHandler;
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
						.catch((e:Exception) => {
							self.exceptionHandler(e,response);
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
						.catch((e:Exception) => {
							self.exceptionHandler(e, response);
						})
					found = true;
				}
			}
			if (!found) {
				self.exceptionHandler(new NotFoundException(), response);	
			}
		});
	}
	
	public listen(port:number,hostname?:string) {
		
		this.server.listen(port,hostname);	
	}
	
	public register(route:RouteHandler) {
		this.routes.push(route);
	}
	
	public setExceptionHandler(fn: (exception:Exception, response:Response) => void) {
		this.exceptionHandler = fn;
	}
	
	private defaultExceptionHandler(exception:Exception, response:Response) {
		console.error(exception.getStack());
		console.error(exception.getMessage());
		console.log(exception.getMessage());
		if (exception instanceof NotFoundException) {
			response.setStatus(HttpStatus.NOT_FOUND);
		}
		
		response.flush();
	}
}

export default App;