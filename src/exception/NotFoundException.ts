import {Exception } from './Exception';

export class NotFoundException extends Exception {
	constructor() {
		super('The requested uri is not found');
	}
}
