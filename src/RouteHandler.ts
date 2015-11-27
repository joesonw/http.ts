import HttpMethod from './HttpMethod';
import Request from './Request';
import Response from './Response';
import Url from './Url';

abstract class RouteHandler {
	constructor() {}
	abstract async handle(request:Request, response:Response);
	getMethod():HttpMethod {
		return HttpMethod.GET;
	}
	getPath():string {
		return '';
	}
}

export default RouteHandler;