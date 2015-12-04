/// <reference path="../_typings/node/node.d.ts"/>
import http = require('http');

import {Map } from '../util/Map';
import {HttpMethod } from '../util/HttpMethod';
import {Url } from './Url';

export class Request {
	private request:http.IncomingMessage;

	private extra:Map<any> = new Map<string>();
	private headers:Map<string> = new Map<string>();
	private httpVersion:string;
	private httpMethod:HttpMethod = null;
	private url:Url;
	private path:string;
	private query:Map<any>;
	private body:string;
	private params:Map<any>;

	constructor(request:http.IncomingMessage, url:Url, body:string) {
		this.request = request;
		this.body = body;
		this.url = url;

		let headers = request.headers || {}
		for (let key in headers) {
			this.headers.set(key, headers[key]);
		}
		this.httpVersion = request.httpVersion;
		switch (request.method.toUpperCase()) {
			case 'GET':
				this.httpMethod = HttpMethod.GET;
				break;
			case 'POST':
				this.httpMethod = HttpMethod.POST;
				break;
			case 'PUT':
				this.httpMethod = HttpMethod.PUT;
				break;
			case 'DELETE':
				this.httpMethod = HttpMethod.DELETE;
				break;
			case 'PATCH':
				this.httpMethod = HttpMethod.PATCH;
				break;
		}

	}

	getHeaders():Map<string> {
		return new Map<string>(this.headers);
	}

	getHeader(key:string):string {
		return this.headers.get(key.toLowerCase()) || '';
	}

	getVersion():string {
		return this.httpVersion;
	}

	getMethod():HttpMethod {
		return this.httpMethod;
	}

	getUrl():Url {
		return this.url;
	}

	getBody():string {
		return this.body;
	}

	setExtra(key:string, value:any) {
		this.extra.set(key,value);
	}

	getExtra(key:string):any {
		return this.extra.get(key);
	}

}
