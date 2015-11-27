/// <reference path="../typings/node/node.d.ts"/>
import http = require('http');

import HttpMethod from './HttpMethod';
import Request from './Request';
import Response from './Response';
import Url from './Url';
import PreProcessor from './PreProcessor';
import PostProcessor from './PostProcessor';


abstract class RouteHandler {
	public subHandlers:{ [fnName:string] : {method:HttpMethod, path:string} };
	private preProcessors:Array<PreProcessor> = new Array<PreProcessor>();
	private postProcessors:Array<PostProcessor> = new Array<PostProcessor>();
	constructor() {
	}
	getMethod():HttpMethod {
		return HttpMethod.GET;
	}
	getPath():string {
		return '';
	}  
	add(processor:PreProcessor) {
		this.preProcessors.push(processor);
	}
	addLast(processor:PostProcessor) {
		this.postProcessors.push(processor);
	}
	async handle(req:http.IncomingMessage, response:Response, buffer:string) {
		let u = req.url;
		let self = this;
		let found = false;
		for (let key in this.subHandlers) {
			let subRoute = this.subHandlers[key];
			if (Url.match(u,this.getPath() + subRoute.path)) {
				let request = new Request(req, Url.parse(u, this.getPath() + subRoute.path), buffer);
				for (let processor of this.preProcessors) {
					await processor.handle(request);
				}
				await this[key](request, response);
				for (let processor of this.postProcessors) {
					await processor.handle(response);
				}
				found = true;
				break;
			}
		}
		if (!found) {
			response.write('not found on handler');
			response.flush();
		}
	}
	
	
}

export default RouteHandler;