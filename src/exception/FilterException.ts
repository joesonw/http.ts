import Exception from './Exception';

export default class FilterException extends Exception {
	constructor(e:any) {
		super('The requested paramters is not processable');
		this.setExtra('detail',e);
	}
}
