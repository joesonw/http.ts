/// <reference path="../_typings/node/node.d.ts"/>
import {Map } from '../util/Map';
export class Exception {
	protected stack:string;
	protected message:string
	protected extra:Map<any> = new Map<any>();
	constructor(message:string, e?:Error) {
		this.message = message;
		if (e) {
			this.stack = e.stack;
		} else {
			this.stack = new Error().stack;
		}
	}
	getStack():string {
		return this.stack;
	}
	getMessage():string {
		return this.message;
	}
	setExtra(key:string, value:any) {
		this.extra.set(key, value);
	}
	getExtra(key:string):any {
		return this.extra.get(key);
	}
}
