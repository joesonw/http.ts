
class Exception {
	protected stack;
	protected message:string
	constructor(message:string) {
		this.message = message;
		this.stack = new Error().stack;
	}
	getStack():any {
		return this.stack;
	}
	getMessage():string {
		return this.message;
	}
}

export default Exception;