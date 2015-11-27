import App from './App';
import HttpMethod from './HttpMethod';
import * as Route from './Route';
import Decorator from './util/Decorator';
import RouteHandler from './RouteHandler';
import JsonReader from './processor/JsonReader';
import JsonWriter from './processor/JsonWriter';

import Url from './Url';
import Request from './Request';
import Response from './Response';

let app:App = new App();

@Route.Path('/test')
class IndexHandler extends RouteHandler {
	
	@Route.SubPath('/:id')
	@Route.Method(HttpMethod.POST)
	async getById(request:Request, response:Response) {
		console.log(request.getUrl());
		console.log(request.getBody());
		console.log(request.getExtra('body'));
		response.setHeader('x-test','yes');
		response.write('Hello world xxx');
		response.setExtra('body',{message: 'hello'})
	}
	
	@Route.Method(HttpMethod.PUT)
	@Route.SubPath('')
	async getIndex(request:Request, response:Response) {
		console.log(request.getUrl());
		response.setHeader('x-test','yes');
		response.write('Hello world xxx');	
	}
}

let index = new IndexHandler();
index.add(new JsonReader());
index.addLast(new JsonWriter());

app.register(index);

app.listen(8080);
console.log('started on 8080');