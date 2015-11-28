import Exception from './Exception';

class NotFoundException extends Exception {
	constructor() {
		super('The requested uri is not found');
	}
}

export default NotFoundException;