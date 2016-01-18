import Exception from './Exception';

export default class NotFoundException extends Exception {
	constructor() {
		super('The requested uri is not found');
	}
}
