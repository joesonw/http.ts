/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../_typings/node/node.d.ts"/>

import http = require('http');
import 'reflect-metadata';

import {HttpMethod } from '../util/HttpMethod';
import {NotFoundException } from '../exception/NotFoundException';
import {Exception } from '../exception/Exception';
import {Request } from '../entity/Request';
import {Response } from './Response';
import {Url } from './Url';
import {ReflectType } from '../util/ReflectType';
import {PreProcessor } from '../processor/PreProcessor';
import {PostProcessor } from '../processor/PostProcessor';


const defaultSubHandlerTypes = [{
	type: Request,
	key: null,
	source: null
},{
	type:Response,
	key: null,
	source: null
}];

export abstract class RouteHandler {

	public subHandlers:{ [fnName:string] : {method:HttpMethod, path:string} };
	public subPreProcessors:{ [fnName:string] : Array<PreProcessor>};
	public subPostProcessors:{ [fnName:string] : Array<PostProcessor>};
	public subHandlerParams: { [fnName:string] : Array<{type:Function, key:string, source:string}>};
	private preProcessors:Array<PreProcessor> = new Array<PreProcessor>();
	private postProcessors:Array<PostProcessor> = new Array<PostProcessor>();

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
		try {
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

					let types = (this.subHandlerParams || {})[key] || defaultSubHandlerTypes;
					let params = [];
					for (let type of types) {
						if (type.source == 'path') {
							params.push(request.getUrl().getParam(type.key));
						} else if (type.source == 'query') {
							params.push(request.getUrl().getQuery(type.key));
						} else {
							if (type.type == Request) {
								params.push(request);
							} else if (type.type == Response) {
								params.push(response);
							} else {
								params.push(null);
							}
						}
					}
					await this[key].apply({},params);

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
		} catch(e) {
			if (e instanceof Exception) {
				throw e;
			}
			throw new Exception('Internal Error', e);
		}
		if (!found) {
			throw new NotFoundException();
		}
	}
}
