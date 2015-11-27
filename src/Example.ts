import App from './App';
import HttpMethod from './HttpMethod';
import * as Route from './Route';
import RouteHandler from './RouteHandler';

import Url from './Url';
import Request from './Request';
import Response from './Response';

let app:App = new App();

@Route.Method(HttpMethod.GET)
@Route.Path('/test/:msg')
class IndexHandler extends RouteHandler {
	async handle(request:Request, response:Response) {
		console.log(request.getUrl());
		response.setHeader('x-test','yes');
		response.write('Hello world');
	}
}

app.register(new IndexHandler());

app.listen(8080);
console.log('started on 8080');