/// <reference path="../../typings/node/node.d.ts"/>
import http = require('http');

/**
 * @module entity
 */

import Map from '../util/Map';
import HttpMethod from '../util/HttpMethod';
import Url from './Url';

/**
 * Wrapped request object, used in [RouteHandler]{@link entity~RouteHandler} primarily
 * @class
 */

class Request {
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
	
	/**
	 * return all headers (empty map if none requested)
	 * @return {util~Map<string>}
	 */
	getHeaders():Map<string> {
		return new Map<string>(this.headers);
	}
	
	/** 
	 * get a specific header (empty string if not found)
	 * @param {string} key - header name try to get
	 * @return {string}
	 */
	getHeader(key:string):string {
		return this.headers.get(key.toLowerCase()) || '';
	}
	
	/**
	 * get request http version
	 * @return {string}
	 */
	getVersion():string {
		return this.httpVersion;
	}
	
	/**
	 * get request http method
	 * @return {util~HttpMethod}
	 */
	getMethod():HttpMethod {
		return this.httpMethod;
	}	
	
	/**
	 * get request url (params,query,body and path)
	 * @return {entity~Url}
	 */
	getUrl():Url {
		return this.url;
	}
	
	/**
	 * get request body
	 * @return {string}
	 */
	getBody():string {
		return this.body;
	}
	
	/**
	 * set extra content (primarily used in [PreProcessor]{@link processor.PreProcessor})
	 * @param {string} key
	 * @param {entity~Url} value
	 */
	setExtra(key:string, value:any) {
		this.extra.set(key,value);
	}
	
	/**
	 * get extra content (usually set by [PreProcessor]{@link processor.PreProcessor}])
	 * @param {string}
	 * @return {any}
	 */
	getExtra(key:string):any {
		return this.extra.get(key);
	}
	
}

export default Request;