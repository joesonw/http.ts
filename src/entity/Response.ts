/// <reference path="../../../shared.ts/typings/node/node.d.ts"/>
import * as http from 'http';

import ContentType from '../util/ContentType';
import HttpStatus from '../util/HttpStatus';
import Map from '../util/Map';


export default class Response {
	private buffer:string = '';
	private status:HttpStatus = HttpStatus.OK;
	private headers:Map<string> = new Map<string>();
	private contentType:ContentType | string = ContentType.TEXT;
	private flushed:boolean = false;
	private extra:Map<any> = new Map<any>();
	private response:http.ServerResponse;

	constructor(response:http.ServerResponse) {
		this.response = response;
	}
	write(data:string) {
		this.buffer = data;
	}
	append(data:string) {
		this.buffer += data;
	}
	setStatus(status:HttpStatus) {
		this.status = status;
	}
	getStatus():HttpStatus {
		return this.status;
	}
	setContentType(type:ContentType | string) {
		this.contentType = type;
	}
	getContentType():ContentType | string {
		return this.contentType;
	}
	getHeaders():Map<string> {
		return new Map(this.headers);
	}
	getHeader(key:string):string {
		return this.headers.get(key);
	}
	setHeaders(headers:Map<string>) {
		this.headers = headers;
	}
	setHeader(key:string, value:string) {
		this.headers.set(key, value);
	}
	flush() {
		if (this.flushed) return;
		let contentType = this.parseContentType();
		let headers = {};
		headers['Content-Type'] = contentType;
		for (let header of this.headers.entrySet()) {
			headers[header.key] = header.value;
		}
		this.response.writeHead(this.status, headers);
		this.response.end(this.buffer);

		this.flushed = true;
	}
	private parseContentType():string {
		if (typeof this.contentType == 'string') {
			return String(this.contentType);
		}
		switch (this.contentType) {
			case ContentType.HTML:
				return 'text/html';
			case ContentType.JSON:
				return 'application/json';
			case ContentType.TEXT:
				return 'text/plain';
			default:
				return 'text/plain';
		}
	}
	setExtra(key:string, value:any) {
		this.extra.set(key,value);
	}
	getExtra(key:string):any {
		return this.extra.get(key);
	}

}
