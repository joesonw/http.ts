/// <reference path="../../typings/node/node.d.ts"/>
import http = require('http');

/**
 * @module entity
 */


import HttpMethod from '../util/HttpMethod';
import NotFoundException from '../exception/NotFoundException';
import Request from './Request';
import Response from './Response';
import Url from './Url';
import PreProcessor from '../processor/PreProcessor';
import PostProcessor from '../processor/PostProcessor';


/**
 * abstract class
 * @class
 */
abstract class RouteHandler {
	public subHandlers:{ [fnName:string] : {method:HttpMethod, path:string} };
	public subPreProcessors:{ [fnName:string] : Array<PreProcessor>};
	public subPostProcessors:{ [fnName:string] : Array<PostProcessor>};
	private preProcessors:Array<PreProcessor> = new Array<PreProcessor>();
	private postProcessors:Array<PostProcessor> = new Array<PostProcessor>();
	
	/**
	 * INTERNAL usage only 
	 */
	getMethod():HttpMethod {
		return HttpMethod.GET;
	}
	
	/**
	 * INTERNAL usage only 
	 */
	getPath():string {
		return '';
	}  
	
	/**
	 * add PreProcessor
	 * @param processor<processor.PreProcessor>
	 */
	add(processor:PreProcessor) {
		this.preProcessors.push(processor);
	}
	
	/**
	 * add PostProcessor
	 * @param processor<processor.PostProcessor>
	 */
	addLast(processor:PostProcessor) {
		this.postProcessors.push(processor);
	}
	
	/**
	 * INTERNAL usage only
	 */
	async handle(req:http.IncomingMessage, response:Response, buffer:string) {
		let u = req.url;
		let self = this;
		let found = false;
		for (let key in this.subHandlers) {
			let subRoute = this.subHandlers[key];
			if (Url.match(u,this.getPath() + subRoute.path)) {
				let request = new Request(req, Url.parse(u, this.getPath() + subRoute.path), buffer);
				for (let processor of (this.preProcessors || [])) {
					await processor.handle(request);
				}
				for (let processor of ((this.subPreProcessors || {})[key] || [])) {
					await processor.handle(request);
				}
				await this[key](request, response);
				for (let processor of ((this.subPostProcessors || {}) [key] || [])) {
					await processor.handle(response);
				}
				for (let processor of (this.postProcessors || [])) {
					await processor.handle(response);
				}
				found = true;
				break;
			}
		}
		if (!found) {
			throw new NotFoundException();
		}
	}
	
	
}

export default RouteHandler;