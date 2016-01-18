import HttpStatus from '../util/HttpStatus';
import Response from '../entity/Response';

export default class ResponseBuilder {
	private _status:HttpStatus;

	public static status(status:HttpStatus) {
		let a = new ResponseBuilder();

		return a;
	}

	public header(key:string, value:string) {

	}

	/**
	 * @internal
	 */
	public build(response:Response) {

	}
}
