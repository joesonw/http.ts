import App from './App';
import HttpMethod from './util/HttpMethod';
import * as Route from './util/Route';
import RouteHandler from './entity/RouteHandler';
import JsonReader from './processor/JsonReader';
import JsonWriter from './processor/JsonWriter';
import Exception from './exception/Exception';
import ContentType from './util/ContentType';
import NotFoundException from './exception/NotFoundException';
import HttpStatus from './util/HttpStatus';
//import Serializable, {MapKey } from './entity/Serializable';

import Url from './entity/Url';
import Request from './entity/Request';
import Response from './entity/Response';

let app:App = new App();

@Route.Path('/test')
class IndexHandler extends RouteHandler {
	public blah:string;
	
	
	@Route.SubPath('/:id')
	@Route.Method(HttpMethod.POST)
	@Route.PostFilter(new JsonWriter())
	@Route.Produce(ContentType.JSON)
	async getById(@Route.QueryParam('asd') asd:string, request:Request, response:Response,@Route.PathParam('id') id:string):Promise<string> {
		console.log(request.getUrl());
		console.log(request.getBody());
		console.log(request.getExtra('body'));
		console.log(id);
		console.log(asd);
		response.setHeader('x-test','yes');
		response.write('Hello world xxx');
		response.setExtra('body',{message: 'hello'});
		return '';
	}
}

let index = new IndexHandler();
index.add(new JsonReader());
//index.addLast(new JsonWriter());

app.setExceptionHandler((exception:Exception, response:Response) => {
	console.error(exception.getStack());
	console.error(exception.getMessage());
	response.write('Custom Exception Handler:' + exception.getMessage());
	if (exception instanceof NotFoundException) {
		response.setStatus(HttpStatus.NOT_FOUND);
	}
	
	response.flush();
});
app.register(index);


app.listen(8080);
console.log('started on 8080');



import Filter from './entity/Filter';
import {Min } from './util/RequestFilter';

class IndexFilter extends Filter {
    @Min(3)
    public test: number;
}

function test<T extends Filter>(constructorFn: new () => T) {
    let obj: T = new constructorFn();
    console.log(obj.__metadata);
}