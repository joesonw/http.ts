import {Exception } from './Exception';

export class FilterException extends Exception {
	constructor(e:any) {
		super('The requested paramters is not processable');
		this.setExtra('detail',e);
	}
}
